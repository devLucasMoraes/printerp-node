import { EntityManager } from "typeorm";
import { UpdateRequisitanteDTO } from "../../../http/validators/requisitante.schemas";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Requisitante } from "../../entities/Requisitante";
import { requisitanteRepository } from "../../repositories";

export const updateRequisitanteUseCase = {
  async execute(id: number, dto: UpdateRequisitanteDTO): Promise<Requisitante> {
    return await requisitanteRepository.manager.transaction(async (manager) => {
      const requisitanteToUpdate = await findRequisitanteToUpdate(id, manager);
      await validate(id, dto, manager);
      const requisitante = await update(requisitanteToUpdate, dto, manager);
      return requisitante;
    });
  },
};

async function findRequisitanteToUpdate(
  id: number,
  manager: EntityManager
): Promise<Requisitante> {
  const requisitante = await manager.findOne(Requisitante, {
    where: { id },
  });

  if (!requisitante) {
    throw new NotFoundError("Requisitante não encontrado");
  }

  return requisitante;
}

async function validate(
  id: number,
  dto: UpdateRequisitanteDTO,
  manager: EntityManager
): Promise<void> {
  const requisitante = await manager.getRepository(Requisitante).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (id !== dto.id) {
    throw new BadRequestError("Id do requisitante não pode ser alterado");
  }

  if (
    requisitante &&
    requisitante.ativo === true &&
    requisitante.id !== dto.id
  ) {
    throw new BadRequestError(
      `Requisitante "${requisitante.nome}" já cadastrado`
    );
  }

  if (requisitante && requisitante.ativo === false) {
    throw new BadRequestError(
      `Requisitante "${requisitante.nome}" já cadastrado e desativado`
    );
  }
}

async function update(
  requisitanteToUpdate: Requisitante,
  dto: UpdateRequisitanteDTO,
  manager: EntityManager
): Promise<Requisitante> {
  const requisitanteDTO = requisitanteRepository.create({
    id: dto.id,
    nome: dto.nome,
    fone: dto.fone,
    userId: dto.userId,
  });

  const requisitante = requisitanteRepository.merge(
    requisitanteToUpdate,
    requisitanteDTO
  );

  return await manager.save(Requisitante, requisitante);
}
