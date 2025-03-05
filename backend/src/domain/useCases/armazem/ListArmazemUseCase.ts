import { Armazem } from "../../entities/Armazem";
import { armazemRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listArmazemUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<Armazem>> {
    return await armazemRepository.findAllPaginated(pageRequest);
  },
};
