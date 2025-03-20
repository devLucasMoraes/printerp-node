import { EntityManager } from "typeorm";
import { CreateParceiroDTO } from "../../../http/validators/parceiro.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Parceiro } from "../../entities/Parceiro";
import { parceiroRepository } from "../../repositories";

export const createParceiroUseCase = {
  async execute(dto: CreateParceiroDTO): Promise<Parceiro> {
    return await parceiroRepository.manager.transaction(async (manager) => {
      await validate(dto, manager);
      const parceiro = await createParceiro(dto, manager);
      return parceiro;
    });
  },
};
async function validate(
  dto: CreateParceiroDTO,
  manager: EntityManager
): Promise<void> {
  const parceiro = await manager.getRepository(Parceiro).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  });

  if (parceiro && parceiro.ativo === true) {
    throw new BadRequestError(`Parceiro "${parceiro.nome}" já cadastrado`);
  }

  if (parceiro && parceiro.ativo === false) {
    throw new BadRequestError(
      `Parceiro "${parceiro.nome}" já cadastrado e desativado`
    );
  }
}

async function createParceiro(
  dto: CreateParceiroDTO,
  manager: EntityManager
): Promise<Parceiro> {
  const parceiroToCreate = parceiroRepository.create({
    nome: dto.nome,
    fone: dto.fone,
    userId: dto.userId,
  });

  return await manager.save(Parceiro, parceiroToCreate);
}
