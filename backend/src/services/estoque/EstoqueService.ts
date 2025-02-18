import { EntityManager } from "typeorm";
import { Armazem } from "../../domain/entities/Armazem";
import { Estoque } from "../../domain/entities/Estoque";
import { Insumo } from "../../domain/entities/Insumo";
import { MovimentoEstoque } from "../../domain/entities/MovimentoEstoque";
import { EstoqueRepository } from "../../domain/repositories/EstoqueRepository";
import { MovimentoEstoqueRepository } from "../../domain/repositories/MovimentoEstoqueRepository";
import { NotFoundError } from "../../shared/errors";

export class EstoqueService {
  constructor(
    private readonly estoqueRepository: EstoqueRepository,
    private readonly movimentoEstoqueRepository: MovimentoEstoqueRepository
  ) {}

  async inicializarEstoque(
    insumo: Insumo,
    armazem: Armazem,
    manager: EntityManager
  ): Promise<Estoque> {
    const estoque = await manager.findOne(Estoque, {
      where: {
        insumo: { id: insumo.id },
        armazem: { id: armazem.id },
      },
    });

    if (!estoque) {
      const newEstoque = this.estoqueRepository.create({
        insumo,
        armazem,
        quantidade: 0,
      });
      return await manager.save(Estoque, newEstoque);
    }

    return estoque;
  }

  async registrarEntrada(
    insumo: Insumo,
    armazem: Armazem,
    quantidade: number,
    valorUnitario: number,
    tipoMovimento: string,
    documentoOrigem: string,
    manager: EntityManager
  ): Promise<void> {
    const estoque = await this.inicializarEstoque(insumo, armazem, manager);

    const movimento = this.movimentoEstoqueRepository.create({
      tipo: "ENTRADA",
      data: new Date(),
      insumo,
      quantidade,
      valorUnitario,
      undEstoque: insumo.undEstoque,
      armazemDestino: armazem,
      documentoOrigem,
      tipoDocumento: tipoMovimento,
      regularizado: true,
    });

    await manager.save(MovimentoEstoque, movimento);

    estoque.quantidade += quantidade;
    await manager.save(Estoque, estoque);
  }

  async registrarSaida(
    insumo: Insumo,
    armazem: Armazem,
    quantidade: number,
    valorUnitario: number,
    tipoMovimento: string,
    documentoOrigem: string,
    manager: EntityManager
  ): Promise<void> {
    const estoque = await manager.findOne(Estoque, {
      where: {
        insumo: { id: insumo.id },
        armazem: { id: armazem.id },
      },
    });

    if (!estoque) {
      throw new NotFoundError(
        `Estoque não encontrado para o insumo ${insumo.id} no armazém ${armazem.id}`
      );
    }

    // Verifica se há saldo suficiente
    if (estoque.quantidade < quantidade) {
      throw new Error(
        `Saldo insuficiente para o insumo ${insumo.id} no armazém ${armazem.id}`
      );
    }

    // Registra o movimento de saída
    const movimento = this.movimentoEstoqueRepository.create({
      tipo: "SAIDA",
      data: new Date(),
      insumo,
      quantidade,
      valorUnitario,
      undEstoque: insumo.undEstoque,
      armazemOrigem: armazem,
      documentoOrigem,
      tipoDocumento: tipoMovimento,
      regularizado: true,
    });

    await manager.save(MovimentoEstoque, movimento);

    // Atualiza o saldo do estoque
    estoque.quantidade -= quantidade;
    await manager.save(Estoque, estoque);
  }

  async transferirEstoque(
    insumo: Insumo,
    armazemOrigem: Armazem,
    armazemDestino: Armazem,
    quantidade: number,
    valorUnitario: number,
    documentoOrigem: string,
    manager: EntityManager
  ): Promise<void> {
    // Registra a saída do armazém de origem
    await this.registrarSaida(
      insumo,
      armazemOrigem,
      quantidade,
      valorUnitario,
      "TRANSFERENCIA",
      documentoOrigem,
      manager
    );

    // Registra a entrada no armazém de destino
    await this.registrarEntrada(
      insumo,
      armazemDestino,
      quantidade,
      valorUnitario,
      "TRANSFERENCIA",
      documentoOrigem,
      manager
    );
  }
}
