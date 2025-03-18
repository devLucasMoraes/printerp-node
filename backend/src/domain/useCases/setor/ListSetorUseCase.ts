import { Setor } from "../../entities/Setor";
import { setorRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listSetorUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<Setor>> {
    return await setorRepository.findAllPaginated(pageRequest);
  },
};
