import { Categoria } from "../../entities/Categoria";
import { categoriaRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listCategoriaUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<Categoria>> {
    return await categoriaRepository.findAllPaginated(pageRequest);
  },
};
