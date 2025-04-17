import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { Emprestimo } from "../../entities/Emprestimo";
import { emprestimoRepository } from "../../repositories";
import { registrarEntradaEstoqueUseCase } from "../estoque/RegistrarEntradaEstoqueUseCase";
import { registrarSaidaEstoqueUseCase } from "../estoque/RegistrarSaidaEstoqueUseCase";

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
    for (const devolucaoItem of item.devolucaoItens) {
      const params = {
        insumo: devolucaoItem.insumo,
        armazem: emprestimoToDelete.armazem,
        quantidade: devolucaoItem.quantidade,
        valorUnitario: devolucaoItem.valorUnitario,
        undEstoque: devolucaoItem.unidade,
        documentoOrigem: emprestimoToDelete.id.toString(),
        observacao: "Movimentação gerada por atualização de emprestimo",
        userId: emprestimoToDelete.userId,
        data: emprestimoToDelete.dataEmprestimo,
        estorno: true,
      };

      if (emprestimoToDelete.tipo === "SAIDA") {
        await registrarSaidaEstoqueUseCase.execute(
          { ...params, tipoDocumento: "EMPRESTIMO" },
          manager
        );
      }

      if (emprestimoToDelete.tipo === "ENTRADA") {
        await registrarEntradaEstoqueUseCase.execute(
          { ...params, tipoDocumento: "EMPRESTIMO" },
          manager
        );
      }
    }

    const params = {
      insumo: item.insumo,
      armazem: emprestimoToDelete.armazem,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      undEstoque: item.unidade,
      documentoOrigem: emprestimoToDelete.id.toString(),
      observacao: "Movimentação gerada por atualização de emprestimo",
      userId: emprestimoToDelete.userId,
      data: emprestimoToDelete.dataEmprestimo,
      estorno: true,
    };

    if (emprestimoToDelete.tipo === "SAIDA") {
      await registrarEntradaEstoqueUseCase.execute(
        { ...params, tipoDocumento: "EMPRESTIMO" },
        manager
      );
    }

    if (emprestimoToDelete.tipo === "ENTRADA") {
      await registrarSaidaEstoqueUseCase.execute(
        { ...params, tipoDocumento: "EMPRESTIMO" },
        manager
      );
    }
  }
}
