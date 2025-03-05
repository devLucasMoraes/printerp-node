import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { Insumo } from "../../entities/Insumo";
import { insumoRepository } from "../../repositories";

export const deleteInsumoUseCase = {
  async execute(id: number, userId: string): Promise<void> {
    return await insumoRepository.manager.transaction(async (manager) => {
      const insumo = await findInsumo(id, manager);
      await disable(insumo, manager, userId);
    });
  },
};

async function findInsumo(id: number, manager: EntityManager): Promise<Insumo> {
  const insumo = await manager.getRepository(Insumo).findOneBy({ id });

  if (!insumo) {
    throw new NotFoundError("Insumo não encontrado");
  }

  return insumo;
}

async function disable(
  insumo: Insumo,
  manager: EntityManager,
  userId: string
): Promise<void> {
  insumo.ativo = false;
  insumo.userId = userId;

  await manager.save(Insumo, insumo);

  await manager.softDelete(Insumo, insumo.id);
}
