import { EntityManager } from "typeorm";
import { BadRequestError } from "../../../shared/errors";
import { Categoria } from "../../entities/Categoria";
import { CategoriaRepository } from "../../repositories/CategoriaRepository";

export class DeleteCategoriaUseCase {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async execute(id: number, userId: string): Promise<void> {
    return await this.categoriaRepository.manager.transaction(
      async (manager) => {
        const categoria = await this.findCategoria(id, manager);
        await this.disable(categoria, manager, userId);
      }
    );
  }

  private async findCategoria(
    id: number,
    manager: EntityManager
  ): Promise<Categoria> {
    const categoria = await manager.getRepository(Categoria).findOneBy({ id });

    if (!categoria) {
      throw new BadRequestError("Categoria não encontrada");
    }

    return categoria;
  }

  private async disable(
    categoria: Categoria,
    manager: EntityManager,
    userId: string
  ): Promise<void> {
    categoria.ativo = false;
    categoria.userId = userId;

    await manager.save(Categoria, categoria);

    await manager.softDelete(Categoria, categoria.id);
  }
}
