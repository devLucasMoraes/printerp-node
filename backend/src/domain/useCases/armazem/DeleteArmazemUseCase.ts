import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { armazemRepository } from "../../repositories";

export const deleteArmazemUseCase = {
  async execute(id: number, userId: string): Promise<void> {
    return await armazemRepository.manager.transaction(async (manager) => {
      const armazem = await findArmazem(id, manager);
      await disable(armazem, manager, userId);
    });
  },
};

async function findArmazem(
  id: number,
  manager: EntityManager
): Promise<Armazem> {
  const armazem = await manager.getRepository(Armazem).findOneBy({ id });

  if (!armazem) {
    throw new NotFoundError("Armazém não encontrado");
  }

  return armazem;
}

async function disable(
  armazem: Armazem,
  manager: EntityManager,
  userId: string
): Promise<void> {
  armazem.ativo = false;
  armazem.userId = userId;

  await manager.save(Armazem, armazem);

  await manager.softDelete(Armazem, armazem.id);
}
