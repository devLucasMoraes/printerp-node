import { EntityManager } from "typeorm";
import { CreateArmazemDTO } from "../../../http/validators/armazem.schema";
import { BadRequestError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { ArmazemRepository } from "../../repositories/ArmazemRepository";

export class CreateArmazemUseCase {
  constructor(private readonly armazemRepository: ArmazemRepository) {}

  async execute(dto: CreateArmazemDTO): Promise<Armazem> {
    return await this.armazemRepository.manager.transaction(async (manager) => {
      await this.validate(dto, manager);
      const armazem = await this.createArmazem(dto, manager);
      return armazem;
    });
  }

  private async validate(
    dto: CreateArmazemDTO,
    manager: EntityManager
  ): Promise<void> {
    const armazem = await manager.getRepository(Armazem).findOne({
      where: { nome: dto.nome },
      withDeleted: true,
    });

    if (armazem && armazem.ativo === true) {
      throw new BadRequestError(`Armazém "${armazem.nome}" já cadastrado`);
    }

    if (armazem && armazem.ativo === false) {
      throw new BadRequestError(
        `Armazém "${armazem.nome}" já cadastrado e desativado`
      );
    }
  }

  private async createArmazem(
    dto: CreateArmazemDTO,
    manager: EntityManager
  ): Promise<Armazem> {
    const armazemToCreate = this.armazemRepository.create({
      nome: dto.nome,
    });

    return await manager.save(Armazem, armazemToCreate);
  }
}
