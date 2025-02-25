import { EntityManager } from "typeorm";
import { Armazem } from "../../entities/Armazem";
import { Estoque } from "../../entities/Estoque";
import { Insumo } from "../../entities/Insumo";
import { MovimentoEstoque } from "../../entities/MovimentoEstoque";
import { Unidade } from "../../entities/Unidade";
import { MovimentoEstoqueRepository } from "../../repositories/MovimentoEstoqueRepository";
import { InicializarEstoqueUseCase } from "./InicializarEstoqueUseCase";

export class RegistrarSaidaEstoqueUseCase {
  constructor(
    private readonly movimentoEstoqueRepository: MovimentoEstoqueRepository,
    private readonly inicializarEstoqueUseCase: InicializarEstoqueUseCase
  ) {}

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
    } = params;

    const estoque = await this.inicializarEstoqueUseCase.execute(
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

    const movimento = this.movimentoEstoqueRepository.create({
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
    });

    await manager.save(MovimentoEstoque, movimento);

    estoque.quantidade = Number(estoque.quantidade) - Number(quantidade);
    await manager.save(Estoque, estoque);
  }
}
