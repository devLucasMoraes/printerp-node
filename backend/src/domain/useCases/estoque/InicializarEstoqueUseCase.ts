import { EntityManager } from "typeorm";
import { Estoque } from "../../entities/Estoque";
import { EstoqueRepository } from "../../repositories/EstoqueRepository";

export class InicializarEstoqueUseCase {
  constructor(private readonly estoqueRepository: EstoqueRepository) {}

  async execute(
    insumoId: number,
    armazemId: number,
    manager: EntityManager
  ): Promise<Estoque> {
    const estoque = await manager.findOne(Estoque, {
      where: {
        insumo: { id: insumoId },
        armazem: { id: armazemId },
      },
    });

    if (!estoque) {
      const newEstoque = this.estoqueRepository.create({
        insumo: { id: insumoId },
        armazem: { id: armazemId },
        quantidade: 0,
      });
      return await manager.save(Estoque, newEstoque);
    }

    return estoque;
  }
}
