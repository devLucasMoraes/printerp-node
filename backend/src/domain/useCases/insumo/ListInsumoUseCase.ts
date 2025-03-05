import { Insumo } from "../../entities/Insumo";
import { insumoRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listInsumoUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<Insumo>> {
    return await insumoRepository.findAllPaginated(pageRequest);
  },
};
