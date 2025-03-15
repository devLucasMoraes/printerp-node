import { EntityManager } from "typeorm";
import { CreateSetorDTO } from "../../../http/validators/setor.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Setor } from "../../entities/Setor";
import { setorRepository } from "../../repositories";

export const createSetorUseCase = {
  async execute(dto: CreateSetorDTO): Promise<Setor> {
    return await setorRepository.manager.transaction(async (manager) => {
      await validate(dto, manager);
      const setor = await createSetor(dto, manager);
      return setor;
    });
  },
};

async function validate(
  dto: CreateSetorDTO,
  manager: EntityManager
): Promise<void> {
  const setor = await manager.getRepository(Setor).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (setor && setor.ativo === true) {
    throw new BadRequestError(`Setor "${setor.nome}" já cadastrado`);
  }

  if (setor && setor.ativo === false) {
    throw new BadRequestError(
      `Setor "${setor.nome}" já cadastrado e desativado`
    );
  }
}

async function createSetor(
  dto: CreateSetorDTO,
  manager: EntityManager
): Promise<Setor> {
  const setorToCreate = setorRepository.create({
    nome: dto.nome,
    userId: dto.userId,
  });

  return await manager.save(Setor, setorToCreate);
}
