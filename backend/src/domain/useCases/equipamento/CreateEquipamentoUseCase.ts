import { EntityManager } from "typeorm";
import { CreateEquipamentoDTO } from "../../../http/validators/equipamento.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Equipamento } from "../../entities/Equipamento";
import { equipamentoRepository } from "../../repositories";

export const createEquipamentoUseCase = {
  async execute(dto: CreateEquipamentoDTO): Promise<Equipamento> {
    return await equipamentoRepository.manager.transaction(async (manager) => {
      await validate(dto, manager);
      const equipamento = await createEquipamento(dto, manager);
      return equipamento;
    });
  },
};

async function validate(
  dto: CreateEquipamentoDTO,
  manager: EntityManager
): Promise<void> {
  const equipamento = await manager.getRepository(Equipamento).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (equipamento && equipamento.ativo === true) {
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

async function createEquipamento(
  dto: CreateEquipamentoDTO,
  manager: EntityManager
): Promise<Equipamento> {
  const equipamentoToCreate = equipamentoRepository.create({
    nome: dto.nome,
    userId: dto.userId,
  });

  return await manager.save(Equipamento, equipamentoToCreate);
}
