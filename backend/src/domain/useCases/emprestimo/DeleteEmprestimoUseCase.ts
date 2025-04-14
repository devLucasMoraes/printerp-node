import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { Emprestimo } from "../../entities/Emprestimo";
import { emprestimoRepository } from "../../repositories";
import { registrarEntradaEstoqueUseCase } from "../estoque/RegistrarEntradaEstoqueUseCase";

export const deleteEmprestimoUseCase = {
  async execute(id: number): Promise<void> {
    return await emprestimoRepository.manager.transaction(async (manager) => {
      const emprestimoToDelete = await findEmprestimoToDelete(id, manager);

      await reverterMovimentacoes(emprestimoToDelete, manager);
      await manager.softRemove(Emprestimo, emprestimoToDelete);
    });
  },
};

async function findEmprestimoToDelete(
  id: number,
  manager: EntityManager
): Promise<Emprestimo> {
  const emprestimo = await manager.findOne(Emprestimo, {
    where: { id },
    relations: {
      parceiro: true,
      armazem: true,
      itens: {
        insumo: true,
        devolucaoItens: {
          insumo: true,
        },
      },
    },
  });

  if (!emprestimo) {
    throw new NotFoundError("Emprestimo not found");
  }

  return emprestimo;
}

async function reverterMovimentacoes(
  emprestimoToDelete: Emprestimo,
  manager: EntityManager
): Promise<void> {
  for (const item of emprestimoToDelete.itens) {
    await registrarEntradaEstoqueUseCase.execute(
      {
        insumo: item.insumo,
        armazem: emprestimoToDelete.armazem,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        undEstoque: item.unidade,
        documentoOrigem: emprestimoToDelete.id.toString(),
        tipoDocumento: "ESTORNO_EMPRESTIMO",
        observacao: `Estorno da movimentação ${emprestimoToDelete.id} - emprestimo deletado`,
        userId: emprestimoToDelete.userId,
        data: emprestimoToDelete.dataEmprestimo,
      },
      manager
    );
  }
}
