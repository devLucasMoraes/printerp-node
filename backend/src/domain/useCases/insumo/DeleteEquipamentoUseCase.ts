import { EntityManager } from "typeorm";
import { BadRequestError } from "../../../shared/errors";
import { Equipamento } from "../../entities/Equipamento";
import { EquipamentoRepository } from "../../repositories/EquipamentoRepository";

export class DeleteEquipamentoUseCase {
  constructor(private readonly equipamentoRepository: EquipamentoRepository) {}

  async execute(id: number, userId: string): Promise<void> {
    return await this.equipamentoRepository.manager.transaction(
      async (manager) => {
        const equipamento = await this.findEquipamento(id, manager);
        await this.disable(equipamento, manager, userId);
      }
    );
  }

  private async findEquipamento(
    id: number,
    manager: EntityManager
  ): Promise<Equipamento> {
    const equipamento = await manager
      .getRepository(Equipamento)
      .findOneBy({ id });

    if (!equipamento) {
      throw new BadRequestError("Equipamento não encontrado");
    }

    return equipamento;
  }

  private async disable(
    equipamento: Equipamento,
    manager: EntityManager,
    userId: string
  ): Promise<void> {
    equipamento.ativo = false;
    equipamento.userId = userId;

    await manager.save(Equipamento, equipamento);

    await manager.softDelete(Equipamento, equipamento.id);
  }
}
