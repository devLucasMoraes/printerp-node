import { EntityManager } from "typeorm";
import { CreateInsumoDTO } from "../../../http/validators/insumo.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Insumo } from "../../entities/Insumo";
import { insumoRepository } from "../../repositories";

export const createInsumoUseCase = {
  async execute(dto: CreateInsumoDTO): Promise<Insumo> {
    return await insumoRepository.manager.transaction(async (manager) => {
      await validate(dto, manager);
      const insumo = await createInsumo(dto, manager);
      return insumo;
    });
  },
};

async function validate(
  dto: CreateInsumoDTO,
  manager: EntityManager
): Promise<void> {
  const insumo = await manager.getRepository(Insumo).findOne({
    where: { descricao: dto.descricao },
    withDeleted: true,
  });

  if (insumo && insumo.ativo === true) {
    throw new BadRequestError(`Insumo "${insumo.descricao}" já cadastrado`);
  }

  if (insumo && insumo.ativo === false) {
    throw new BadRequestError(
      `Insumo "${insumo.descricao}" já cadastrado e desativado`
    );
  }
}

async function createInsumo(
  dto: CreateInsumoDTO,
  manager: EntityManager
): Promise<Insumo> {
  const insumoToCreate = insumoRepository.create({
    descricao: dto.descricao,
    valorUntMed: dto.valorUntMed,
    valorUntMedAuto: dto.valorUntMedAuto,
    undEstoque: dto.undEstoque,
    estoqueMinimo: dto.estoqueMinimo,
    categoria: dto.categoria,
    userId: dto.userId,
  });

  return await manager.save(Insumo, insumoToCreate);
}
