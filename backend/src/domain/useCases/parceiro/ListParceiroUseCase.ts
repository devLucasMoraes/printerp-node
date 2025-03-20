import { Parceiro } from "../../entities/Parceiro";
import { parceiroRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listParceiroUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<Parceiro>> {
    return await parceiroRepository.findAllPaginated(pageRequest);
  },
};
