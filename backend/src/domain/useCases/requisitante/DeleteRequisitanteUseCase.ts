import { EntityManager } from "typeorm";
import { BadRequestError } from "../../../shared/errors";
import { Requisitante } from "../../entities/Requisitante";
import { RequisitanteRepository } from "../../repositories/RequisitanteRepository";

export class DeleteRequisitanteUseCase {
  constructor(
    private readonly requisitanteRepository: RequisitanteRepository
  ) {}

  async execute(id: number, userId: string): Promise<void> {
    return await this.requisitanteRepository.manager.transaction(
      async (manager) => {
        const requisitante = await this.findRequisitante(id, manager);
        await this.disable(requisitante, manager, userId);
      }
    );
  }

  private async findRequisitante(
    id: number,
    manager: EntityManager
  ): Promise<Requisitante> {
    const requisitante = await manager
      .getRepository(Requisitante)
      .findOneBy({ id });

    if (!requisitante) {
      throw new BadRequestError("Requisitante não encontrado");
    }

    return requisitante;
  }

  private async disable(
    requisitante: Requisitante,
    manager: EntityManager,
    userId: string
  ): Promise<void> {
    requisitante.ativo = false;
    requisitante.userId = userId;

    await manager.save(Requisitante, requisitante);

    await manager.softDelete(Requisitante, requisitante.id);
  }
}
