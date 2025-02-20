import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { RequisicaoEstoqueRepository } from "../../repositories/RequisicaoEstoqueRepository";
import { RegistrarEntradaEstoqueUseCase } from "../estoque/RegistrarEntradaEstoqueUseCase";

export class DeleteRequisicaoEstoqueUseCase {
  constructor(
    private readonly requisicaoEstoqueRepository: RequisicaoEstoqueRepository,
    private readonly registrarEntradaEstoqueUseCase: RegistrarEntradaEstoqueUseCase
  ) {}

  async execute(id: number): Promise<void> {
    return await this.requisicaoEstoqueRepository.manager.transaction(
      async (manager) => {
        const requisicaoToDelete = await this.findRequisicaoToDelete(
          id,
          manager
        );

        await this.reverterMovimentacoes(requisicaoToDelete, manager);
        await manager.softDelete(RequisicaoEstoque, id);
      }
    );
  }

  private async findRequisicaoToDelete(
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
    requisicaoToDelete: RequisicaoEstoque,
    manager: EntityManager
  ): Promise<void> {
    for (const item of requisicaoToDelete.itens) {
      await this.registrarEntradaEstoqueUseCase.execute(
        {
          insumo: item.insumo,
          armazem: requisicaoToDelete.armazem,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          undEstoque: item.undEstoque,
          documentoOrigem: requisicaoToDelete.id.toString(),
          tipoDocumento: "ESTORNO_REQUISICAO",
          observacao: `Estorno da movimentação ${requisicaoToDelete.id} - requisição deletada`,
        },
        manager
      );
    }
  }
}
