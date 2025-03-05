import { Equipamento } from "../../entities/Equipamento";
import { equipamentoRepository } from "../../repositories";

export const getAllEquipamentoUseCase = {
  async execute(): Promise<Equipamento[]> {
    return await equipamentoRepository.find();
  },
};
