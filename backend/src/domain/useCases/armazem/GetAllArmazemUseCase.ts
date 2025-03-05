import { Armazem } from "../../entities/Armazem";
import { armazemRepository } from "../../repositories";

export const getAllArmazemUseCase = {
  async execute(): Promise<Armazem[]> {
    return await armazemRepository.find();
  },
};
