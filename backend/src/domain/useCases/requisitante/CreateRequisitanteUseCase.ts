import { EntityManager } from "typeorm";
import { CreateRequisitanteDTO } from "../../../http/validators/requisitante.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Requisitante } from "../../entities/Requisitante";
import { requisitanteRepository } from "../../repositories";

export const createRequisitanteUseCase = {
  async execute(dto: CreateRequisitanteDTO): Promise<Requisitante> {
    return await requisitanteRepository.manager.transaction(async (manager) => {
      await validate(dto, manager);
      const requisitante = await createRequisitante(dto, manager);
      return requisitante;
    });
  },
};
async function validate(
  dto: CreateRequisitanteDTO,
  manager: EntityManager
): Promise<void> {
  const requisitante = await manager.getRepository(Requisitante).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (requisitante && requisitante.ativo === true) {
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

async function createRequisitante(
  dto: CreateRequisitanteDTO,
  manager: EntityManager
): Promise<Requisitante> {
  const requisitanteToCreate = requisitanteRepository.create({
    nome: dto.nome,
    fone: dto.fone,
    userId: dto.userId,
  });

  return await manager.save(Requisitante, requisitanteToCreate);
}
