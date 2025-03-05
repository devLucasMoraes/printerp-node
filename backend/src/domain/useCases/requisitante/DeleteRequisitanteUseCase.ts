import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { Requisitante } from "../../entities/Requisitante";
import { requisitanteRepository } from "../../repositories";

export const deleteRequisitanteUseCase = {
  async execute(id: number, userId: string): Promise<void> {
    return await requisitanteRepository.manager.transaction(async (manager) => {
      const requisitante = await findRequisitante(id, manager);
      await disable(requisitante, manager, userId);
    });
  },
};

async function findRequisitante(
  id: number,
  manager: EntityManager
): Promise<Requisitante> {
  const requisitante = await manager
    .getRepository(Requisitante)
    .findOneBy({ id });

  if (!requisitante) {
    throw new NotFoundError("Requisitante não encontrado");
  }

  return requisitante;
}

async function disable(
  requisitante: Requisitante,
  manager: EntityManager,
  userId: string
): Promise<void> {
  requisitante.ativo = false;
  requisitante.userId = userId;

  await manager.save(Requisitante, requisitante);

  await manager.softDelete(Requisitante, requisitante.id);
}
