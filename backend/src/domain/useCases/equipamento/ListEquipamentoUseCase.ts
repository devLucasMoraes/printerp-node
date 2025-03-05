import { Equipamento } from "../../entities/Equipamento";
import { equipamentoRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listEquipamentoUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<Equipamento>> {
    return await equipamentoRepository.findAllPaginated(pageRequest);
  },
};
