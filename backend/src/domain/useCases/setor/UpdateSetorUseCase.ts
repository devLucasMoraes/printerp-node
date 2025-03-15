import { EntityManager } from "typeorm";
import { UpdateSetorDTO } from "../../../http/validators/setor.schemas";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Setor } from "../../entities/Setor";
import { setorRepository } from "../../repositories";

export const updateSetorUseCase = {
  async execute(id: number, dto: UpdateSetorDTO): Promise<Setor> {
    return await setorRepository.manager.transaction(async (manager) => {
      const setorToUpdate = await findSetorToUpdate(id, manager);
      await validate(id, dto, manager);
      const setor = await update(setorToUpdate, dto, manager);
      return setor;
    });
  },
};

async function findSetorToUpdate(
  id: number,
  manager: EntityManager
): Promise<Setor> {
  const setor = await manager.findOne(Setor, {
    where: { id },
  });

  if (!setor) {
    throw new NotFoundError("Setor não encontrado");
  }

  return setor;
}

async function validate(
  id: number,
  dto: UpdateSetorDTO,
  manager: EntityManager
): Promise<void> {
  const setor = await manager.getRepository(Setor).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (id !== dto.id) {
    throw new BadRequestError("Id do setor não pode ser alterado");
  }

  if (setor && setor.ativo === true && setor.id !== dto.id) {
    throw new BadRequestError(`Setor "${setor.nome}" já cadastrado`);
  }

  if (setor && setor.ativo === false) {
    throw new BadRequestError(
      `Setor "${setor.nome}" já cadastrado e desativado`
    );
  }
}

async function update(
  setorToUpdate: Setor,
  dto: UpdateSetorDTO,
  manager: EntityManager
): Promise<Setor> {
  const setorDTO = setorRepository.create({
    id: dto.id,
    nome: dto.nome,
    userId: dto.userId,
  });

  const setor = setorRepository.merge(setorToUpdate, setorDTO);

  return await manager.save(Setor, setor);
}
