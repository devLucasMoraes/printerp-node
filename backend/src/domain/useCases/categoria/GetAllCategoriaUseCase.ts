import { Categoria } from "../../entities/Categoria";
import { categoriaRepository } from "../../repositories";

export const getAllCategoriaUseCase = {
  async execute(): Promise<Categoria[]> {
    return await categoriaRepository.find();
  },
};
