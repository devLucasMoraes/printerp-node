import { Insumo } from "../../entities/Insumo";
import { insumoRepository } from "../../repositories";

export const getAllInsumoUseCase = {
  async execute(): Promise<Insumo[]> {
    return await insumoRepository.find();
  },
};
