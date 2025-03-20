import { EntityManager } from "typeorm";
import { UpdateParceiroDTO } from "../../../http/validators/parceiro.schemas";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Parceiro } from "../../entities/Parceiro";
import { parceiroRepository } from "../../repositories";

export const updateParceiroUseCase = {
  async execute(id: number, dto: UpdateParceiroDTO): Promise<Parceiro> {
    return await parceiroRepository.manager.transaction(async (manager) => {
      const parceiroToUpdate = await findParceiroToUpdate(id, manager);
      await validate(id, dto, manager);
      const parceiro = await update(parceiroToUpdate, dto, manager);
      return parceiro;
    });
  },
};

async function findParceiroToUpdate(
  id: number,
  manager: EntityManager
): Promise<Parceiro> {
  const parceiro = await manager.findOne(Parceiro, {
    where: { id },
  });

  if (!parceiro) {
    throw new NotFoundError("Parceiro não encontrado");
  }

  return parceiro;
}

async function validate(
  id: number,
  dto: UpdateParceiroDTO,
  manager: EntityManager
): Promise<void> {
  const parceiro = await manager.getRepository(Parceiro).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (id !== dto.id) {
    throw new BadRequestError("Id do parceiro não pode ser alterado");
  }

  if (parceiro && parceiro.ativo === true && parceiro.id !== dto.id) {
    throw new BadRequestError(`Parceiro "${parceiro.nome}" já cadastrado`);
  }

  if (parceiro && parceiro.ativo === false) {
    throw new BadRequestError(
      `Parceiro "${parceiro.nome}" já cadastrado e desativado`
    );
  }
}

async function update(
  parceiroToUpdate: Parceiro,
  dto: UpdateParceiroDTO,
  manager: EntityManager
): Promise<Parceiro> {
  const parceiroDTO = parceiroRepository.create({
    id: dto.id,
    nome: dto.nome,
    fone: dto.fone,
    userId: dto.userId,
  });

  const parceiro = parceiroRepository.merge(parceiroToUpdate, parceiroDTO);

  return await manager.save(Parceiro, parceiro);
}
