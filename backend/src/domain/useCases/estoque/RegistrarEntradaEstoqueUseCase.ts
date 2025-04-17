import { EntityManager } from "typeorm";
import { Armazem } from "../../entities/Armazem";
import { Estoque } from "../../entities/Estoque";
import { Insumo } from "../../entities/Insumo";
import { MovimentoEstoque } from "../../entities/MovimentoEstoque";
import { Unidade } from "../../entities/Unidade";
import { movimentoEstoqueRepository } from "../../repositories";
import { atualizarConsumoMedioDiarioUseCase } from "./AtualizarConsumoMedioDiarioUseCase";
import { inicializarEstoqueUseCase } from "./InicializarEstoqueUseCase";

export const registrarEntradaEstoqueUseCase = {
  async execute(
    params: {
      insumo: Insumo;
      armazem: Armazem;
      quantidade: number;
      valorUnitario: number;
      undEstoque: Unidade;
      tipoDocumento: string;
      documentoOrigem: string;
      userId: string;
      observacao?: string;
      data: Date;
      estorno?: boolean;
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
      data,
      estorno,
    } = params;

    const estoque = await inicializarEstoqueUseCase.execute(
      insumo.id,
      armazem.id,
      manager
    );

    const movimento = movimentoEstoqueRepository.create({
      tipo: "ENTRADA",
      data,
      insumo,
      quantidade,
      valorUnitario,
      undidade: undEstoque,
      armazemDestino: armazem,
      documentoOrigem,
      tipoDocumento,
      regularizado: true,
      observacao,
      userId,
      estorno,
    });

    await manager.save(MovimentoEstoque, movimento);

    estoque.quantidade = Number(estoque.quantidade) + Number(quantidade);
    await manager.save(Estoque, estoque);

    await atualizarConsumoMedioDiarioUseCase.execute(
      insumo.id,
      armazem.id,
      manager,
      true // Forçar atualização
    );
  },
};
