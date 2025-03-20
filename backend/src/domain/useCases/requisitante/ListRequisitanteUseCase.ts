import { Requisitante } from "../../entities/Requisitante";
import { requisitanteRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listRequisitanteUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<Requisitante>> {
    return await requisitanteRepository.findAllPaginated(pageRequest);
  },
};
