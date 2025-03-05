import { EntityManager } from "typeorm";
import { CreateArmazemDTO } from "../../../http/validators/armazem.schema";
import { BadRequestError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { armazemRepository } from "../../repositories";

export const createArmazemUseCase = {
  async execute(dto: CreateArmazemDTO): Promise<Armazem> {
    return await armazemRepository.manager.transaction(async (manager) => {
      await validate(dto, manager);
      const armazem = await createArmazem(dto, manager);
      return armazem;
    });
  },
};
async function validate(
  dto: CreateArmazemDTO,
  manager: EntityManager
): Promise<void> {
  const armazem = await manager.getRepository(Armazem).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (armazem && armazem.ativo === true) {
    throw new BadRequestError(`Armazém "${armazem.nome}" já cadastrado`);
  }

  if (armazem && armazem.ativo === false) {
    throw new BadRequestError(
      `Armazém "${armazem.nome}" já cadastrado e desativado`
    );
  }
}

async function createArmazem(
  dto: CreateArmazemDTO,
  manager: EntityManager
): Promise<Armazem> {
  const armazemToCreate = armazemRepository.create({
    nome: dto.nome,
    userId: dto.userId,
  });

  return await manager.save(Armazem, armazemToCreate);
}
