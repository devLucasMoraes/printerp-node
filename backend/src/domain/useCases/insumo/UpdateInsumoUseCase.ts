import { EntityManager } from "typeorm";
import { UpdateInsumoDTO } from "../../../http/validators/insumo.schemas";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Insumo } from "../../entities/Insumo";
import { insumoRepository } from "../../repositories";

export const updateInsumoUseCase = {
  async execute(id: number, dto: UpdateInsumoDTO): Promise<Insumo> {
    return await insumoRepository.manager.transaction(async (manager) => {
      const insumoToUpdate = await findInsumoToUpdate(id, manager);
      await validate(id, dto, manager);
      const insumo = await update(insumoToUpdate, dto, manager);
      return insumo;
    });
  },
};

async function findInsumoToUpdate(
  id: number,
  manager: EntityManager
): Promise<Insumo> {
  const insumo = await manager.findOne(Insumo, {
    where: { id },
  });

  if (!insumo) {
    throw new NotFoundError("Insumo não encontrado");
  }

  return insumo;
}

async function validate(
  id: number,
  dto: UpdateInsumoDTO,
  manager: EntityManager
): Promise<void> {
  const insumo = await manager.getRepository(Insumo).findOne({
    where: { descricao: dto.descricao },
    withDeleted: true,
  });

  if (id !== dto.id) {
    throw new BadRequestError("Id do insumo não pode ser alterado");
  }

  if (insumo && insumo.ativo === true && insumo.id !== dto.id) {
    throw new BadRequestError(`Insumo "${insumo.descricao}" já cadastrado`);
  }

  if (insumo && insumo.ativo === false) {
    throw new BadRequestError(
      `Insumo "${insumo.descricao}" já cadastrado e desativado`
    );
  }
}

async function update(
  insumoToUpdate: Insumo,
  dto: UpdateInsumoDTO,
  manager: EntityManager
): Promise<Insumo> {
  const insumoDTO = insumoRepository.create({
    id: dto.id,
    descricao: dto.descricao,
    valorUntMed: dto.valorUntMed,
    valorUntMedAuto: dto.valorUntMedAuto,
    undEstoque: dto.undEstoque,
    estoqueMinimo: dto.estoqueMinimo,
    categoria: dto.categoria,
    userId: dto.userId,
  });

  const insumo = insumoRepository.merge(insumoToUpdate, insumoDTO);

  return await manager.save(Insumo, insumo);
}
