import { EntityManager } from "typeorm";
import { BadRequestError } from "../../../shared/errors";
import { Insumo } from "../../entities/Insumo";
import { InsumoRepository } from "../../repositories/InsumoRepository";

export class DeleteInsumoUseCase {
  constructor(private readonly insumoRepository: InsumoRepository) {}

  async execute(id: number, userId: string): Promise<void> {
    return await this.insumoRepository.manager.transaction(async (manager) => {
      const insumo = await this.findInsumo(id, manager);
      await this.disable(insumo, manager, userId);
    });
  }

  private async findInsumo(
    id: number,
    manager: EntityManager
  ): Promise<Insumo> {
    const insumo = await manager.getRepository(Insumo).findOneBy({ id });

    if (!insumo) {
      throw new BadRequestError("Insumo não encontrado");
    }

    return insumo;
  }

  private async disable(
    insumo: Insumo,
    manager: EntityManager,
    userId: string
  ): Promise<void> {
    insumo.ativo = false;
    insumo.userId = userId;

    await manager.save(Insumo, insumo);

    await manager.softDelete(Insumo, insumo.id);
  }
}
