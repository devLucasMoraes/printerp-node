import { Parceiro } from "../../entities/Parceiro";
import { parceiroRepository } from "../../repositories";

export const getAllParceiroUseCase = {
  async execute(): Promise<Parceiro[]> {
    return await parceiroRepository.find();
  },
};
