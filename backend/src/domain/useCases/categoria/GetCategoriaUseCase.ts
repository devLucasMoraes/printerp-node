import { NotFoundError } from "../../../shared/errors";
import { Categoria } from "../../entities/Categoria";
import { categoriaRepository } from "../../repositories";

export const getCategoriaUseCase = {
  async execute(id: number): Promise<Categoria> {
    const categoria = await categoriaRepository.findOneBy({ id });

    if (!categoria) {
      throw new NotFoundError("Categoria não encontrada");
    }

    return categoria;
  },
};
