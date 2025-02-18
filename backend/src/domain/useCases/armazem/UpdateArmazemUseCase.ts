import { EntityManager } from "typeorm";
import { UpdateArmazemDTO } from "../../../http/validators/armazem.schema";
import { BadRequestError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { ArmazemRepository } from "../../repositories/ArmazemRepository";

export class UpdateArmazemUseCase {
  constructor(private readonly armazemRepository: ArmazemRepository) {}

  async execute(id: number, dto: UpdateArmazemDTO): Promise<Armazem> {
    return await this.armazemRepository.manager.transaction(async (manager) => {
      const armazemToUpdate = await this.findArmazemToUpdate(id, manager);
      await this.validate(id, dto, manager);
      const armazem = await this.update(armazemToUpdate, dto, manager);
      return armazem;
    });
  }

  private async findArmazemToUpdate(
    id: number,
    manager: EntityManager
  ): Promise<Armazem> {
    const armazem = await manager.findOne(Armazem, {
      where: { id },
    });

    if (!armazem) {
      throw new BadRequestError("Armazém não encontrado");
    }

    return armazem;
  }

  private async validate(
    id: number,
    dto: UpdateArmazemDTO,
    manager: EntityManager
  ): Promise<void> {
    const armazem = await manager.getRepository(Armazem).findOne({
      where: { nome: dto.nome },
      withDeleted: true,
    });

    if (id !== dto.id) {
      throw new BadRequestError("Id do armazém não pode ser alterado");
    }

    if (armazem && armazem.ativo === true && armazem.id !== dto.id) {
      throw new BadRequestError(`Armazém "${armazem.nome}" já cadastrado`);
    }

    if (armazem && armazem.ativo === false) {
      throw new BadRequestError(
        `Armazém "${armazem.nome}" já cadastrado e desativado`
      );
    }
  }

  private async update(
    armazemToUpdate: Armazem,
    dto: UpdateArmazemDTO,
    manager: EntityManager
  ): Promise<Armazem> {
    const armazemDTO = this.armazemRepository.create({
      id: dto.id,
      nome: dto.nome,
    });

    const armazem = this.armazemRepository.merge(armazemToUpdate, armazemDTO);

    return await manager.save(Armazem, armazem);
  }
}
