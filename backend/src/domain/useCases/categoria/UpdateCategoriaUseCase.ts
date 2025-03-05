import { EntityManager } from "typeorm";
import { UpdateCategoriaDTO } from "../../../http/validators/categoria.schemas";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Categoria } from "../../entities/Categoria";
import { categoriaRepository } from "../../repositories";

export const updateCategoriaUseCase = {
  async execute(id: number, dto: UpdateCategoriaDTO): Promise<Categoria> {
    return await categoriaRepository.manager.transaction(async (manager) => {
      const categoriaToUpdate = await findCategoriaToUpdate(id, manager);
      await validate(id, dto, manager);
      const categoria = await update(categoriaToUpdate, dto, manager);
      return categoria;
    });
  },
};

async function findCategoriaToUpdate(
  id: number,
  manager: EntityManager
): Promise<Categoria> {
  const categoria = await manager.findOne(Categoria, {
    where: { id },
  });

  if (!categoria) {
    throw new NotFoundError("Armazém não encontrado");
  }

  return categoria;
}

async function validate(
  id: number,
  dto: UpdateCategoriaDTO,
  manager: EntityManager
): Promise<void> {
  const categoria = await manager.getRepository(Categoria).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (id !== dto.id) {
    throw new BadRequestError("Id do armazém não pode ser alterado");
  }

  if (categoria && categoria.ativo === true && categoria.id !== dto.id) {
    throw new BadRequestError(`Armazém "${categoria.nome}" já cadastrado`);
  }

  if (categoria && categoria.ativo === false) {
    throw new BadRequestError(
      `Armazém "${categoria.nome}" já cadastrado e desativado`
    );
  }
}

async function update(
  categoriaToUpdate: Categoria,
  dto: UpdateCategoriaDTO,
  manager: EntityManager
): Promise<Categoria> {
  const categoriaDTO = categoriaRepository.create({
    id: dto.id,
    nome: dto.nome,
    userId: dto.userId,
  });

  const categoria = categoriaRepository.merge(categoriaToUpdate, categoriaDTO);

  return await manager.save(Categoria, categoria);
}
