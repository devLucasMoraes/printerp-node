import { EntityManager } from "typeorm";
import { Armazem } from "../../entities/Armazem";
import { Estoque } from "../../entities/Estoque";
import { Insumo } from "../../entities/Insumo";
import { MovimentoEstoque } from "../../entities/MovimentoEstoque";
import { Unidade } from "../../entities/Unidade";
import { MovimentoEstoqueRepository } from "../../repositories/MovimentoEstoqueRepository";
import { InicializarEstoqueUseCase } from "./InicializarEstoqueUseCase";

export class RegistrarEntradaEstoqueUseCase {
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
    } = params;

    const estoque = await this.inicializarEstoqueUseCase.execute(
      insumo.id,
      armazem.id,
      manager
    );

    const movimento = this.movimentoEstoqueRepository.create({
      tipo: "ENTRADA",
      data: new Date(),
      insumo,
      quantidade,
      valorUnitario,
      undEstoque,
      armazemDestino: armazem,
      documentoOrigem,
      tipoDocumento,
      regularizado: true,
    });

    await manager.save(MovimentoEstoque, movimento);

    estoque.quantidade = Number(estoque.quantidade) + Number(quantidade);
    await manager.save(Estoque, estoque);
  }
}
