import { Setor } from "../../entities/Setor";
import { setorRepository } from "../../repositories";

export const getAllSetorUseCase = {
  async execute(): Promise<Setor[]> {
    return await setorRepository.find();
  },
};
