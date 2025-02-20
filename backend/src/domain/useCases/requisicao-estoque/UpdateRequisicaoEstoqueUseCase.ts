import { EntityManager } from "typeorm";
import { UpdateRequisicaoEstoqueDTO } from "../../../http/validators/requisicaoEstoque.schemas";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { Equipamento } from "../../entities/Equipamento";
import { Insumo } from "../../entities/Insumo";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { Requisitante } from "../../entities/Requisitante";
import { RequisicaoEstoqueRepository } from "../../repositories/RequisicaoEstoqueRepository";
import { RegistrarEntradaEstoqueUseCase } from "../estoque/RegistrarEntradaEstoqueUseCase";
import { RegistrarSaidaEstoqueUseCase } from "../estoque/RegistrarSaidaEstoqueUseCase";

export class UpdateRequisicaoEstoqueUseCase {
  constructor(
    private readonly requisicaoEstoqueRepository: RequisicaoEstoqueRepository,
    private readonly registrarEntradaEstoqueUseCase: RegistrarEntradaEstoqueUseCase,
    private readonly registrarSaidaEstoqueUseCase: RegistrarSaidaEstoqueUseCase
  ) {}

  async execute(
    id: number,
    dto: UpdateRequisicaoEstoqueDTO
  ): Promise<RequisicaoEstoque> {
    return await this.requisicaoEstoqueRepository.manager.transaction(
      async (manager) => {
        const requisicaoToUpdate = await this.findRequisicaoToUpdate(
          id,
          manager
        );
        await this.validate(requisicaoToUpdate, dto, manager);
        await this.reverterMovimentacoes(requisicaoToUpdate, manager);
        const requisicaoAtualizada = await this.updateRequisicao(
          requisicaoToUpdate,
          dto,
          manager
        );
        await this.processarNovasMovimentacoes(requisicaoAtualizada, manager);

        return requisicaoAtualizada;
      }
    );
  }

  private async findRequisicaoToUpdate(
    id: number,
    manager: EntityManager
  ): Promise<RequisicaoEstoque> {
    const requisicao = await manager.findOne(RequisicaoEstoque, {
      where: { id },
      relations: {
        requisitante: true,
        equipamento: true,
        armazem: true,
        itens: {
          insumo: true,
        },
      },
    });

    if (!requisicao) {
      throw new NotFoundError("RequisicaoEstoque not found");
    }

    return requisicao;
  }

  private async validate(
    requisicaoToUpdate: RequisicaoEstoque,
    requisicaoDTO: UpdateRequisicaoEstoqueDTO,
    manager: EntityManager
  ): Promise<void> {
    const requisitante = await manager.findOne(Requisitante, {
      where: { id: requisicaoDTO.requisitante.id },
    });

    if (!requisitante) {
      throw new BadRequestError("Requisitante nao encontrado");
    }

    const equipamento = await manager.findOne(Equipamento, {
      where: { id: requisicaoDTO.equipamento.id },
    });

    if (!equipamento) {
      throw new BadRequestError("Equipamento nao encontrado");
    }

    const armazem = await manager.findOne(Armazem, {
      where: { id: requisicaoDTO.armazem.id },
    });

    if (!armazem) {
      throw new BadRequestError("Armazem nao encontrado");
    }

    if (requisicaoDTO.itens.length === 0) {
      throw new BadRequestError(
        "Requisicao Estoque deve ter pelo menos um item"
      );
    }

    for (const itemDTO of requisicaoDTO.itens) {
      if (itemDTO.id !== null) {
        const itemPertence = requisicaoToUpdate.itens.some(
          (itemExistente) => itemExistente.id === itemDTO.id
        );

        if (!itemPertence) {
          throw new BadRequestError(
            `Não é possível atualizar o item de outra requisição`
          );
        }
      }
      const insumo = await manager.findOne(Insumo, {
        where: { id: itemDTO.insumo.id },
      });
      if (!insumo) {
        throw new BadRequestError("Insumo nao encontrado");
      }
      if (itemDTO.quantidade <= 0) {
        throw new BadRequestError("Quantidade deve ser maior que zero");
      }
      if (itemDTO.undEstoque !== insumo.undEstoque) {
        throw new BadRequestError(
          "Unidade deve ser igual a unidade do estoque"
        );
      }
    }
  }

  private async reverterMovimentacoes(
    requisicaoToUpdate: RequisicaoEstoque,
    manager: EntityManager
  ): Promise<void> {
    for (const item of requisicaoToUpdate.itens) {
      await this.registrarEntradaEstoqueUseCase.execute(
        {
          insumo: item.insumo,
          armazem: requisicaoToUpdate.armazem,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          undEstoque: item.undEstoque,
          documentoOrigem: requisicaoToUpdate.id.toString(),
          tipoDocumento: "ESTORNO_REQUISICAO",
          observacao: `Estorno da movimentação ${requisicaoToUpdate.id} - Atualização de requisição`,
        },
        manager
      );
    }
  }

  private async updateRequisicao(
    requisicaoToUpdate: RequisicaoEstoque,
    dto: UpdateRequisicaoEstoqueDTO,
    manager: EntityManager
  ): Promise<RequisicaoEstoque> {
    const requisicaoDto = this.requisicaoEstoqueRepository.create({
      dataRequisicao: dto.dataRequisicao,
      ordemProducao: dto.ordemProducao,
      valorTotal: dto.valorTotal,
      obs: dto.obs,
      requisitante: dto.requisitante,
      equipamento: dto.equipamento,
      armazem: dto.armazem,
      itens: dto.itens.map((itemDTO) => {
        return {
          id: itemDTO.id || undefined,
          insumo: itemDTO.insumo,
          quantidade: itemDTO.quantidade,
          undEstoque: itemDTO.undEstoque,
          valorUnitario: itemDTO.valorUnitario,
        };
      }),
    });

    const {
      requisitante: _r,
      equipamento: _e,
      itens: _i,
      ...requisicaoEstoqueWithoutRelations
    } = requisicaoToUpdate;

    const updatedRequisicaoEstoque = this.requisicaoEstoqueRepository.merge(
      requisicaoEstoqueWithoutRelations as RequisicaoEstoque,
      requisicaoDto
    );

    return await manager.save(RequisicaoEstoque, updatedRequisicaoEstoque);
  }

  private async processarNovasMovimentacoes(
    requisicao: RequisicaoEstoque,
    manager: EntityManager
  ): Promise<void> {
    // Criar novas movimentações para cada item
    for (const item of requisicao.itens) {
      await this.registrarSaidaEstoqueUseCase.execute(
        {
          insumo: item.insumo,
          armazem: requisicao.armazem,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          undEstoque: item.undEstoque,
          documentoOrigem: requisicao.id.toString(),
          tipoDocumento: "REQUISICAO",
          observacao: "Movimentação gerada por atualização de requisição",
        },
        manager
      );
    }
  }
}
