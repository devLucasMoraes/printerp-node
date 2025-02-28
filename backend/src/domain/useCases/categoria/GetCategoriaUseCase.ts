import { NotFoundError } from "../../../shared/errors";
import { Categoria } from "../../entities/Categoria";
import { CategoriaRepository } from "../../repositories/CategoriaRepository";

export class GetCategoriaUseCase {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async execute(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOneBy({ id });

    if (!categoria) {
      throw new NotFoundError("Categoria não encontrada");
    }

    return categoria;
  }
}
