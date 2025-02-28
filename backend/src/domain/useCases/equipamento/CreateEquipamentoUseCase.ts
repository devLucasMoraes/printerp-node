import { EntityManager } from "typeorm";
import { CreateEquipamentoDTO } from "../../../http/validators/equipamento.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Equipamento } from "../../entities/Equipamento";
import { EquipamentoRepository } from "../../repositories/EquipamentoRepository";

export class CreateEquipamentoUseCase {
  constructor(private readonly equipamentoRepository: EquipamentoRepository) {}

  async execute(dto: CreateEquipamentoDTO): Promise<Equipamento> {
    return await this.equipamentoRepository.manager.transaction(
      async (manager) => {
        await this.validate(dto, manager);
        const equipamento = await this.createEquipamento(dto, manager);
        return equipamento;
      }
    );
  }

  private async validate(
    dto: CreateEquipamentoDTO,
    manager: EntityManager
  ): Promise<void> {
    const equipamento = await manager.getRepository(Equipamento).findOne({
      where: { nome: dto.nome },
      withDeleted: true,
    });

    if (equipamento && equipamento.ativo === true) {
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

  private async createEquipamento(
    dto: CreateEquipamentoDTO,
    manager: EntityManager
  ): Promise<Equipamento> {
    const equipamentoToCreate = this.equipamentoRepository.create({
      nome: dto.nome,
      userId: dto.userId,
    });

    return await manager.save(Equipamento, equipamentoToCreate);
  }
}
