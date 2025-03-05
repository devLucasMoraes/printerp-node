import { EntityManager } from "typeorm";
import { UpdateEquipamentoDTO } from "../../../http/validators/equipamento.schemas";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Equipamento } from "../../entities/Equipamento";
import { equipamentoRepository } from "../../repositories";

export const updateEquipamentoUseCase = {
  async execute(id: number, dto: UpdateEquipamentoDTO): Promise<Equipamento> {
    return await equipamentoRepository.manager.transaction(async (manager) => {
      const equipamentoToUpdate = await findEquipamentoToUpdate(id, manager);
      await validate(id, dto, manager);
      const equipamento = await update(equipamentoToUpdate, dto, manager);
      return equipamento;
    });
  },
};

async function findEquipamentoToUpdate(
  id: number,
  manager: EntityManager
): Promise<Equipamento> {
  const equipamento = await manager.findOne(Equipamento, {
    where: { id },
  });

  if (!equipamento) {
    throw new NotFoundError("Equipamento não encontrado");
  }

  return equipamento;
}

async function validate(
  id: number,
  dto: UpdateEquipamentoDTO,
  manager: EntityManager
): Promise<void> {
  const equipamento = await manager.getRepository(Equipamento).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (id !== dto.id) {
    throw new BadRequestError("Id do equipamento não pode ser alterado");
  }

  if (equipamento && equipamento.ativo === true && equipamento.id !== dto.id) {
    throw new BadRequestError(
      `Equipamento "${equipamento.nome}" já cadastrado`
    );
  }

  if (equipamento && equipamento.ativo === false) {
    throw new BadRequestError(
      `Equipamento "${equipamento.nome}" já cadastrado e desativado`
    );
  }
}

async function update(
  equipamentoToUpdate: Equipamento,
  dto: UpdateEquipamentoDTO,
  manager: EntityManager
): Promise<Equipamento> {
  const equipamentoDTO = equipamentoRepository.create({
    id: dto.id,
    nome: dto.nome,
    userId: dto.userId,
  });

  const equipamento = equipamentoRepository.merge(
    equipamentoToUpdate,
    equipamentoDTO
  );

  return await manager.save(Equipamento, equipamento);
}
