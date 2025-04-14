import { Estoque } from "../../entities/Estoque";
import { estoqueRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";
import { atualizarConsumoMedioDiarioUseCase } from "./AtualizarConsumoMedioDiarioUseCase";

export const listEstoqueUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<Estoque>> {
    return await estoqueRepository.manager.transaction(async (manager) => {
      const estoques = await estoqueRepository.find({
        relations: {
          insumo: true,
          armazem: true,
        },
      });
      for (const estoque of estoques) {
        await atualizarConsumoMedioDiarioUseCase.execute(
          estoque.insumo.id,
          estoque.armazem.id,
          manager
        );
      }
      return await estoqueRepository.findAllPaginated(pageRequest);
    });
  },
};
