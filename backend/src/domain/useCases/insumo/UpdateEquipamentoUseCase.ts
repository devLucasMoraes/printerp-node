import { EntityManager } from "typeorm";
import { UpdateEquipamentoDTO } from "../../../http/validators/equipamento.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Equipamento } from "../../entities/Equipamento";
import { EquipamentoRepository } from "../../repositories/EquipamentoRepository";

export class UpdateEquipamentoUseCase {
  constructor(private readonly equipamentoRepository: EquipamentoRepository) {}

  async execute(id: number, dto: UpdateEquipamentoDTO): Promise<Equipamento> {
    return await this.equipamentoRepository.manager.transaction(
      async (manager) => {
        const equipamentoToUpdate = await this.findEquipamentoToUpdate(
          id,
          manager
        );
        await this.validate(id, dto, manager);
        const equipamento = await this.update(
          equipamentoToUpdate,
          dto,
          manager
        );
        return equipamento;
      }
    );
  }

  private async findEquipamentoToUpdate(
    id: number,
    manager: EntityManager
  ): Promise<Equipamento> {
    const equipamento = await manager.findOne(Equipamento, {
      where: { id },
    });

    if (!equipamento) {
      throw new BadRequestError("Equipamento não encontrado");
    }

    return equipamento;
  }

  private async validate(
    id: number,
    dto: UpdateEquipamentoDTO,
    manager: EntityManager
  ): Promise<void> {
    const equipamento = await manager.getRepository(Equipamento).findOne({
      where: { nome: dto.nome },
      withDeleted: true,
    });

    if (id !== dto.id) {
      throw new BadRequestError("Id do equipamento não pode ser alterado");
    }

    if (
      equipamento &&
      equipamento.ativo === true &&
      equipamento.id !== dto.id
    ) {
      throw new BadRequestError(
        `Equipamento "${equipamento.nome}" já cadastrado`
      );
    }

    if (equipamento && equipamento.ativo === false) {
      throw new BadRequestError(
        `Equipamento "${equipamento.nome}" já cadastrado e desativado`
      );
    }
  }

  private async update(
    equipamentoToUpdate: Equipamento,
    dto: UpdateEquipamentoDTO,
    manager: EntityManager
  ): Promise<Equipamento> {
    const equipamentoDTO = this.equipamentoRepository.create({
      id: dto.id,
      nome: dto.nome,
      userId: dto.userId,
    });

    const equipamento = this.equipamentoRepository.merge(
      equipamentoToUpdate,
      equipamentoDTO
    );

    return await manager.save(Equipamento, equipamento);
  }
}
