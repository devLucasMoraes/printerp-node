import { EntityManager } from "typeorm";
import { CreateRequisicaoEstoqueDTO } from "../../../http/validators/requisicaoEstoque.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Equipamento } from "../../entities/Equipamento";
import { Insumo } from "../../entities/Insumo";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { Requisitante } from "../../entities/Requisitante";
import { RequisicaoEstoqueRepository } from "../../repositories/RequisicaoEstoqueRepository";
import { RegistrarSaidaEstoqueUseCase } from "../estoque/RegistrarSaidaEstoqueUseCase";

export class CreateRequisicaoEstoqueUseCase {
  constructor(
    private readonly requisicaoEstoqueRepository: RequisicaoEstoqueRepository,
    private readonly registrarSaidaEstoqueUseCase: RegistrarSaidaEstoqueUseCase
  ) {}

  async execute(dto: CreateRequisicaoEstoqueDTO): Promise<RequisicaoEstoque> {
    return await this.requisicaoEstoqueRepository.manager.transaction(
      async (manager) => {
        await this.validate(dto, manager);
        const requisicao = await this.createRequisicao(dto, manager);
        await this.processarMovimentacoes(requisicao, manager);
        return requisicao;
      }
    );
  }

  private async validate(
    dto: CreateRequisicaoEstoqueDTO,
    manager: EntityManager
  ): Promise<void> {
    const requisitante = await manager.findOne(Requisitante, {
      where: { id: dto.requisitante.id },
    });

    if (!requisitante) {
      throw new BadRequestError("Requisitante nao encontrado");
    }

    const equipamento = await manager.findOne(Equipamento, {
      where: { id: dto.equipamento.id },
    });

    if (!equipamento) {
      throw new BadRequestError("Equipamento nao encontrado");
    }

    if (dto.itens.length === 0) {
      throw new BadRequestError(
        "Requisicao Estoque deve ter pelo menos um item"
      );
    }

    for (const item of dto.itens) {
      const insumo = await manager.findOne(Insumo, {
        where: { id: item.insumo.id },
      });
      if (!insumo) {
        throw new BadRequestError("Insumo nao encontrado");
      }

      if (item.quantidade <= 0) {
        throw new BadRequestError("Quantidade deve ser maior que zero");
      }

      if (item.undEstoque !== insumo.undEstoque) {
        throw new BadRequestError(
          "Unidade deve ser igual a unidade do estoque"
        );
      }
    }
  }

  private async createRequisicao(
    dto: CreateRequisicaoEstoqueDTO,
    manager: EntityManager
  ): Promise<RequisicaoEstoque> {
    const requisicaoToCreate = this.requisicaoEstoqueRepository.create({
      dataRequisicao: dto.dataRequisicao,
      ordemProducao: dto.ordemProducao,
      valorTotal: dto.valorTotal,
      obs: dto.obs,
      requisitante: dto.requisitante,
      equipamento: dto.equipamento,
      armazem: dto.armazem,
      itens: dto.itens.map((itemDTO) => {
        return {
          insumo: itemDTO.insumo,
          quantidade: itemDTO.quantidade,
          undEstoque: itemDTO.undEstoque,
          valorUnitario: itemDTO.valorUnitario,
        };
      }),
    });

    return await manager.save(RequisicaoEstoque, requisicaoToCreate);
  }

  private async processarMovimentacoes(
    requisicao: RequisicaoEstoque,
    manager: EntityManager
  ): Promise<void> {
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
        },
        manager
      );
    }
  }
}
