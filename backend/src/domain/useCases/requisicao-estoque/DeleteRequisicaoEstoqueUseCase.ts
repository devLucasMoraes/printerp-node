import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { requisicaoEstoqueRepository } from "../../repositories";
import { registrarEntradaEstoqueUseCase } from "../estoque/RegistrarEntradaEstoqueUseCase";

export const deleteRequisicaoEstoqueUseCase = {
  async execute(id: number): Promise<void> {
    return await requisicaoEstoqueRepository.manager.transaction(
      async (manager) => {
        const requisicaoToDelete = await findRequisicaoToDelete(id, manager);

        await reverterMovimentacoes(requisicaoToDelete, manager);
        await manager.softRemove(RequisicaoEstoque, requisicaoToDelete);
      }
    );
  },
};

async function findRequisicaoToDelete(
  id: number,
  manager: EntityManager
): Promise<RequisicaoEstoque> {
  const requisicao = await manager.findOne(RequisicaoEstoque, {
    where: { id },
    relations: {
      requisitante: true,
      setor: true,
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

async function reverterMovimentacoes(
  requisicaoToDelete: RequisicaoEstoque,
  manager: EntityManager
): Promise<void> {
  for (const item of requisicaoToDelete.itens) {
    await registrarEntradaEstoqueUseCase.execute(
      {
        insumo: item.insumo,
        armazem: requisicaoToDelete.armazem,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        undEstoque: item.unidade,
        documentoOrigem: requisicaoToDelete.id.toString(),
        tipoDocumento: "REQUISICAO",
        observacao: `Estorno da movimentação ${requisicaoToDelete.id} - requisição deletada`,
        userId: requisicaoToDelete.userId,
        data: requisicaoToDelete.dataRequisicao,
        estorno: true,
      },
      manager
    );
  }
}
