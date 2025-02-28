import { Categoria } from "../../entities/Categoria";
import { Page, PageRequest } from "../../repositories/BaseRepository";
import { CategoriaRepository } from "../../repositories/CategoriaRepository";

export class ListCategoriaUseCase {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async execute(pageRequest?: PageRequest): Promise<Page<Categoria>> {
    return await this.categoriaRepository.findAllPaginated(pageRequest);
  }
}
