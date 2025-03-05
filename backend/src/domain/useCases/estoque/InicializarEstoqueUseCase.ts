import { EntityManager } from "typeorm";
import { Estoque } from "../../entities/Estoque";
import { estoqueRepository } from "../../repositories";

export const inicializarEstoqueUseCase = {
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
      const newEstoque = estoqueRepository.create({
        insumo: { id: insumoId },
        armazem: { id: armazemId },
        quantidade: 0,
      });
      return await manager.save(Estoque, newEstoque);
    }

    return estoque;
  },
};
