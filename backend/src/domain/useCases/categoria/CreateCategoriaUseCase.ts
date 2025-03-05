import { EntityManager } from "typeorm";
import { CreateCategoriaDTO } from "../../../http/validators/categoria.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Categoria } from "../../entities/Categoria";
import { categoriaRepository } from "../../repositories";

export const createCategoriaUseCase = {
  async execute(dto: CreateCategoriaDTO): Promise<Categoria> {
    return await categoriaRepository.manager.transaction(async (manager) => {
      await validate(dto, manager);
      const categoria = await createCategoria(dto, manager);
      return categoria;
    });
  },
};

async function validate(
  dto: CreateCategoriaDTO,
  manager: EntityManager
): Promise<void> {
  const categoria = await manager.getRepository(Categoria).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (categoria && categoria.ativo === true) {
    throw new BadRequestError(`Categoria "${categoria.nome}" já cadastrada`);
  }

  if (categoria && categoria.ativo === false) {
    throw new BadRequestError(
      `Categoria "${categoria.nome}" já cadastrada e desativada`
    );
  }
}

async function createCategoria(
  dto: CreateCategoriaDTO,
  manager: EntityManager
): Promise<Categoria> {
  const categoriaToCreate = categoriaRepository.create({
    nome: dto.nome,
    userId: dto.userId,
  });

  return await manager.save(Categoria, categoriaToCreate);
}
