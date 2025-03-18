import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { Setor } from "../../entities/Setor";
import { setorRepository } from "../../repositories";

export const deleteSetorUseCase = {
  async execute(id: number, userId: string): Promise<void> {
    return await setorRepository.manager.transaction(async (manager) => {
      const setor = await findSetor(id, manager);
      await disable(setor, manager, userId);
    });
  },
};

async function findSetor(id: number, manager: EntityManager): Promise<Setor> {
  const setor = await manager.getRepository(Setor).findOneBy({ id });

  if (!setor) {
    throw new NotFoundError("Setor não encontrado");
  }

  return setor;
}

async function disable(
  setor: Setor,
  manager: EntityManager,
  userId: string
): Promise<void> {
  setor.ativo = false;
  setor.userId = userId;

  await manager.save(Setor, setor);

  await manager.softDelete(Setor, setor.id);
}
