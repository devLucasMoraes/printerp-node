import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { Parceiro } from "../../entities/Parceiro";
import { parceiroRepository } from "../../repositories";

export const deleteParceiroUseCase = {
  async execute(id: number, userId: string): Promise<void> {
    return await parceiroRepository.manager.transaction(async (manager) => {
      const parceiro = await findParceiro(id, manager);
      await disable(parceiro, manager, userId);
    });
  },
};

async function findParceiro(
  id: number,
  manager: EntityManager
): Promise<Parceiro> {
  const parceiro = await manager.getRepository(Parceiro).findOneBy({ id });

  if (!parceiro) {
    throw new NotFoundError("Parceiro não encontrado");
  }

  return parceiro;
}

async function disable(
  parceiro: Parceiro,
  manager: EntityManager,
  userId: string
): Promise<void> {
  parceiro.ativo = false;
  parceiro.userId = userId;

  await manager.save(Parceiro, parceiro);

  await manager.softDelete(Parceiro, parceiro.id);
}
