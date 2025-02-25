import { EntityManager } from "typeorm";
import { BadRequestError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { ArmazemRepository } from "../../repositories/ArmazemRepository";

export class DeleteArmazemUseCase {
  constructor(private readonly armazemRepository: ArmazemRepository) {}

  async execute(id: number, userId: string): Promise<void> {
    return await this.armazemRepository.manager.transaction(async (manager) => {
      const armazem = await this.findArmazem(id, manager);
      await this.disable(armazem, manager, userId);
    });
  }

  private async findArmazem(
    id: number,
    manager: EntityManager
  ): Promise<Armazem> {
    const armazem = await manager.getRepository(Armazem).findOneBy({ id });

    if (!armazem) {
      throw new BadRequestError("Armazém não encontrado");
    }

    return armazem;
  }

  private async disable(
    armazem: Armazem,
    manager: EntityManager,
    userId: string
  ): Promise<void> {
    armazem.ativo = false;
    armazem.userId = userId;

    await manager.save(Armazem, armazem);

    await manager.softDelete(Armazem, armazem.id);
  }
}
