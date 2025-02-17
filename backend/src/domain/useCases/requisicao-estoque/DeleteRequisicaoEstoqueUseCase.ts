import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { MovimentoEstoqueRepository } from "../../repositories/MovimentoEstoqueRepository";
import { RequisicaoEstoqueRepository } from "../../repositories/RequisicaoEstoqueRepository";

export class DeleteRequisicaoEstoqueUseCase {
  constructor(
    private readonly requisicaoEstoqueRepository: RequisicaoEstoqueRepository,
    private readonly movimentoEstoqueRepository: MovimentoEstoqueRepository
  ) {}

  async execute(id: number): Promise<void> {
    return await this.requisicaoEstoqueRepository.manager.transaction(
      async (manager) => {
        const requisicao = await this.buscarRequisicaoCompleta(id, manager);

        if (!requisicao) {
          throw new NotFoundError("RequisicaoEstoque not found");
        }

        await this.reverterMovimentacoes(requisicao, manager);
        await manager.softDelete(RequisicaoEstoque, id);
      }
    );
  }

  private async buscarRequisicaoCompleta(
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

  private async reverterMovimentacoes(
    requisicao: RequisicaoEstoque,
    manager: EntityManager
  ): Promise<void> {
    // Implementação similar ao método de reversão do UpdateUseCase
  }
}
