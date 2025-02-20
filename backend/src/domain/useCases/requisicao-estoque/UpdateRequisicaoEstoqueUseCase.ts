import { EntityManager } from "typeorm";
import { UpdateRequisicaoEstoqueDTO } from "../../../http/validators/requisicaoEstoque.schemas";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Estoque } from "../../entities/Estoque";
import { MovimentoEstoque } from "../../entities/MovimentoEstoque";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { EstoqueRepository } from "../../repositories/EstoqueRepository";
import { MovimentoEstoqueRepository } from "../../repositories/MovimentoEstoqueRepository";
import { RequisicaoEstoqueRepository } from "../../repositories/RequisicaoEstoqueRepository";

export class UpdateRequisicaoEstoqueUseCase {
  constructor(
    private readonly requisicaoEstoqueRepository: RequisicaoEstoqueRepository,
    private readonly estoqueRepository: EstoqueRepository,
    private readonly movimentoEstoqueRepository: MovimentoEstoqueRepository
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
        const requisicaoAtualizada = await this.atualizarRequisicao(
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
    requisicaoExistente: RequisicaoEstoque,
    requisicaoDTO: UpdateRequisicaoEstoqueDTO,
    manager: EntityManager
  ): Promise<void> {
    // Se houver mudança de armazém, validar disponibilidade no novo armazém
    if (requisicaoDTO.armazem.id !== requisicaoExistente.armazem.id) {
      for (const itemDTO of requisicaoDTO.itens) {
        const estoque = await manager.findOne(Estoque, {
          where: {
            insumo: { id: itemDTO.insumo.id },
            armazem: { id: requisicaoDTO.armazem.id },
          },
        });

        if (!estoque) {
          throw new NotFoundError(
            `Insumo ${itemDTO.insumo.id} não encontrado no novo armazém ${requisicaoDTO.armazem.id}`
          );
        }

        // Ao validar quantidade, considerar o que será estornado do armazém anterior
        const itemExistente = requisicaoExistente.itens.find(
          (i) => i.insumo.id === itemDTO.insumo.id
        );

        const quantidadeAdicional = itemExistente
          ? itemDTO.quantidade - itemExistente.quantidade
          : itemDTO.quantidade;

        /*  
        if (!estoque.possuiQuantidadeSuficiente(quantidadeAdicional)) {
          throw new BadRequestError(
            `Quantidade insuficiente do insumo ${itemDTO.insumo.id} no novo armazém ${requisicaoDTO.armazem.id}`
          );
        }
        */
      }
    }
  }

  private async reverterMovimentacoes(
    requisicao: RequisicaoEstoque,
    manager: EntityManager
  ): Promise<void> {
    // Buscar movimentações relacionadas à requisição
    const movimentacoesAnteriores = await manager.find(MovimentoEstoque, {
      where: {
        documentoOrigem: requisicao.id.toString(),
        tipoDocumento: "REQUISICAO",
      },
      relations: {
        insumo: true,
        armazemOrigem: true,
      },
    });

    // Criar movimentações de estorno
    for (const movimentacao of movimentacoesAnteriores) {
      const estorno = this.movimentoEstoqueRepository.create({
        tipo: "ENTRADA",
        data: new Date(),
        insumo: movimentacao.insumo,
        quantidade: movimentacao.quantidade,
        valorUnitario: movimentacao.valorUnitario,
        undEstoque: movimentacao.undEstoque,
        armazemDestino: movimentacao.armazemOrigem,
        documentoOrigem: requisicao.id.toString(),
        tipoDocumento: "ESTORNO_REQUISICAO",
        regularizado: true,
        observacao: `Estorno da movimentação ${movimentacao.id} - Atualização de requisição`,
      });

      await manager.save(MovimentoEstoque, estorno);

      // Atualizar saldo no estoque
      const estoque = await manager.findOne(Estoque, {
        where: {
          insumo: { id: movimentacao.insumo.id },
          armazem: { id: movimentacao.armazemOrigem.id },
        },
      });

      if (!estoque) {
        throw new NotFoundError(
          `Estoque do insumo ${movimentacao.insumo.id} no armazém ${movimentacao.armazemOrigem.id} not found`
        );
      }
      estoque.quantidade =
        Number(estoque.quantidade) + Number(movimentacao.quantidade);
      await manager.save(Estoque, estoque);
    }

    // Marcar movimentações anteriores como regularizadas
    await manager.update(
      MovimentoEstoque,
      {
        documentoOrigem: requisicao.id.toString(),
        tipoDocumento: "REQUISICAO",
      },
      { regularizado: true }
    );
  }

  private async atualizarRequisicao(
    requisicaoExistente: RequisicaoEstoque,
    dto: UpdateRequisicaoEstoqueDTO,
    manager: EntityManager
  ): Promise<RequisicaoEstoque> {
    // Validar se os itens com ID pertencem a esta requisição
    const itensComId = dto.itens.filter((item) => item.id !== null);

    const todosItensPertencem = itensComId.every((itemDTO) =>
      requisicaoExistente.itens.some(
        (itemExistente) => itemExistente.id === itemDTO.id
      )
    );

    if (!todosItensPertencem) {
      throw new BadRequestError("Cannot update item from another requisicao");
    }

    const requisicaoToUpdate = this.requisicaoEstoqueRepository.create({
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
      ...requisicaoEstoqueBase
    } = requisicaoExistente;

    const updatedRequisicaoEstoque = this.requisicaoEstoqueRepository.merge(
      requisicaoEstoqueBase as RequisicaoEstoque,
      requisicaoToUpdate
    );

    return await manager.save(RequisicaoEstoque, updatedRequisicaoEstoque);
  }

  private async processarNovasMovimentacoes(
    requisicao: RequisicaoEstoque,
    manager: EntityManager
  ): Promise<void> {
    // Criar novas movimentações para cada item
    for (const item of requisicao.itens) {
      const movimentoToCreate = this.movimentoEstoqueRepository.create({
        tipo: "SAIDA",
        data: new Date(),
        insumo: item.insumo,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        undEstoque: item.undEstoque,
        armazemOrigem: requisicao.armazem,
        documentoOrigem: requisicao.id.toString(),
        tipoDocumento: "REQUISICAO",
        regularizado: true,
        observacao: "Movimentação gerada por atualização de requisição",
      });

      await manager.save(MovimentoEstoque, movimentoToCreate);

      // Atualizar saldo no estoque
      const estoque = await manager.findOne(Estoque, {
        where: {
          insumo: { id: item.insumo.id },
          armazem: { id: requisicao.armazem.id },
        },
      });

      if (!estoque) {
        throw new NotFoundError(
          `Estoque do insumo ${item.insumo.id} no armazém ${requisicao.armazem.id} not found`
        );
      }

      estoque.quantidade -= item.quantidade;
      await manager.save(Estoque, estoque);
    }
  }
}
