import { Categoria } from "../../entities/Categoria";
import { CategoriaRepository } from "../../repositories/CategoriaRepository";

export class GetAllCategoriaUseCase {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async execute(): Promise<Categoria[]> {
    return await this.categoriaRepository.find();
  }
}
