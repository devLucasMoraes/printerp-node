import { EntityManager } from "typeorm";
import { Armazem } from "../../entities/Armazem";
import { Estoque } from "../../entities/Estoque";
import { Insumo } from "../../entities/Insumo";
import { MovimentoEstoque } from "../../entities/MovimentoEstoque";
import { Unidade } from "../../entities/Unidade";
import { movimentoEstoqueRepository } from "../../repositories";
import { inicializarEstoqueUseCase } from "./InicializarEstoqueUseCase";

export const registrarSaidaEstoqueUseCase = {
  async execute(
    params: {
      insumo: Insumo;
      armazem: Armazem;
      quantidade: number;
      valorUnitario: number;
      undEstoque: Unidade;
      tipoDocumento: string;
      documentoOrigem: string;
      observacao?: string;
      userId: string;
    },
    manager: EntityManager
  ): Promise<void> {
    const {
      insumo,
      armazem,
      quantidade,
      valorUnitario,
      undEstoque,
      tipoDocumento,
      documentoOrigem,
      observacao,
      userId,
    } = params;

    const estoque = await inicializarEstoqueUseCase.execute(
      insumo.id,
      armazem.id,
      manager
    );

    /*
    if (estoque.quantidade < quantidade) {
      throw new Error(
        `Saldo insuficiente para o insumo ${insumo.id} no armazém ${armazem.id}`
      );
    }
    */

    const movimento = movimentoEstoqueRepository.create({
      tipo: "SAIDA",
      data: new Date(),
      insumo,
      quantidade,
      valorUnitario,
      undidade: undEstoque,
      armazemOrigem: armazem,
      documentoOrigem,
      tipoDocumento,
      observacao,
      regularizado: true,
      userId,
    });

    await manager.save(MovimentoEstoque, movimento);

    estoque.quantidade = Number(estoque.quantidade) - Number(quantidade);
    await manager.save(Estoque, estoque);
  },
};
