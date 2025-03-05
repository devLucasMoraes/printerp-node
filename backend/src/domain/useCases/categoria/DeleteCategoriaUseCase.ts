import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { Categoria } from "../../entities/Categoria";
import { categoriaRepository } from "../../repositories";

export const deleteCategoriaUseCase = {
  async execute(id: number, userId: string): Promise<void> {
    return await categoriaRepository.manager.transaction(async (manager) => {
      const categoria = await findCategoria(id, manager);
      await disable(categoria, manager, userId);
    });
  },
};

async function findCategoria(
  id: number,
  manager: EntityManager
): Promise<Categoria> {
  const categoria = await manager.getRepository(Categoria).findOneBy({ id });

  if (!categoria) {
    throw new NotFoundError("Categoria não encontrada");
  }

  return categoria;
}

async function disable(
  categoria: Categoria,
  manager: EntityManager,
  userId: string
): Promise<void> {
  categoria.ativo = false;
  categoria.userId = userId;

  await manager.save(Categoria, categoria);

  await manager.softDelete(Categoria, categoria.id);
}
