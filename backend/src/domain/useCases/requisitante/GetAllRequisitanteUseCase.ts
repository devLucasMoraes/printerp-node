import { Requisitante } from "../../entities/Requisitante";
import { requisitanteRepository } from "../../repositories";

export const getAllRequisitanteUseCase = {
  async execute(): Promise<Requisitante[]> {
    return await requisitanteRepository.find();
  },
};
