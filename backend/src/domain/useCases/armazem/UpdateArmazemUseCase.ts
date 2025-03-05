import { EntityManager } from "typeorm";
import { UpdateArmazemDTO } from "../../../http/validators/armazem.schema";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { armazemRepository } from "../../repositories";

export const updateArmazemUseCase = {
  async execute(id: number, dto: UpdateArmazemDTO): Promise<Armazem> {
    return await armazemRepository.manager.transaction(async (manager) => {
      const armazemToUpdate = await findArmazemToUpdate(id, manager);
      await validate(id, dto, manager);
      const armazem = await update(armazemToUpdate, dto, manager);
      return armazem;
    });
  },
};
async function findArmazemToUpdate(
  id: number,
  manager: EntityManager
): Promise<Armazem> {
  const armazem = await manager.findOne(Armazem, {
    where: { id },
  });

  if (!armazem) {
    throw new NotFoundError("Armazém não encontrado");
  }

  return armazem;
}

async function validate(
  id: number,
  dto: UpdateArmazemDTO,
  manager: EntityManager
): Promise<void> {
  const armazem = await manager.getRepository(Armazem).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (id !== dto.id) {
    throw new BadRequestError("Id do armazém não pode ser alterado");
  }

  if (armazem && armazem.ativo === true && armazem.id !== dto.id) {
    throw new BadRequestError(`Armazém "${armazem.nome}" já cadastrado`);
  }

  if (armazem && armazem.ativo === false) {
    throw new BadRequestError(
      `Armazém "${armazem.nome}" já cadastrado e desativado`
    );
  }
}

async function update(
  armazemToUpdate: Armazem,
  dto: UpdateArmazemDTO,
  manager: EntityManager
): Promise<Armazem> {
  const armazemDTO = armazemRepository.create({
    id: dto.id,
    nome: dto.nome,
    userId: dto.userId,
  });

  const armazem = armazemRepository.merge(armazemToUpdate, armazemDTO);

  return await manager.save(Armazem, armazem);
}
