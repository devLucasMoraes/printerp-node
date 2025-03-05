import { Estoque } from "../../entities/Estoque";
import { estoqueRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listEstoqueUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<Estoque>> {
    return await estoqueRepository.findAllPaginated(pageRequest);
  },
};
