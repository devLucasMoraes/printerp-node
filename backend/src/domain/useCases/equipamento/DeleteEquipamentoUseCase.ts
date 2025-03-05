import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { Equipamento } from "../../entities/Equipamento";
import { equipamentoRepository } from "../../repositories";

export const deleteEquipamentoUseCase = {
  async execute(id: number, userId: string): Promise<void> {
    return await equipamentoRepository.manager.transaction(async (manager) => {
      const equipamento = await findEquipamento(id, manager);
      await disable(equipamento, manager, userId);
    });
  },
};

async function findEquipamento(
  id: number,
  manager: EntityManager
): Promise<Equipamento> {
  const equipamento = await manager
    .getRepository(Equipamento)
    .findOneBy({ id });

  if (!equipamento) {
    throw new NotFoundError("Equipamento não encontrado");
  }

  return equipamento;
}

async function disable(
  equipamento: Equipamento,
  manager: EntityManager,
  userId: string
): Promise<void> {
  equipamento.ativo = false;
  equipamento.userId = userId;

  await manager.save(Equipamento, equipamento);

  await manager.softDelete(Equipamento, equipamento.id);
}
