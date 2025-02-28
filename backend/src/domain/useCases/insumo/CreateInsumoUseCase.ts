import { EntityManager } from "typeorm";
import { CreateInsumoDTO } from "../../../http/validators/insumo.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Insumo } from "../../entities/Insumo";
import { InsumoRepository } from "../../repositories/InsumoRepository";

export class CreateInsumoUseCase {
  constructor(private readonly insumoRepository: InsumoRepository) {}

  async execute(dto: CreateInsumoDTO): Promise<Insumo> {
    return await this.insumoRepository.manager.transaction(async (manager) => {
      await this.validate(dto, manager);
      const insumo = await this.createInsumo(dto, manager);
      return insumo;
    });
  }

  private async validate(
    dto: CreateInsumoDTO,
    manager: EntityManager
  ): Promise<void> {
    const insumo = await manager.getRepository(Insumo).findOne({
      where: { descricao: dto.descricao },
      withDeleted: true,
    });

    if (insumo && insumo.ativo === true) {
      throw new BadRequestError(`Insumo "${insumo.descricao}" já cadastrado`);
    }

    if (insumo && insumo.ativo === false) {
      throw new BadRequestError(
        `Insumo "${insumo.descricao}" já cadastrado e desativado`
      );
    }
  }

  private async createInsumo(
    dto: CreateInsumoDTO,
    manager: EntityManager
  ): Promise<Insumo> {
    const insumoToCreate = this.insumoRepository.create({
      descricao: dto.descricao,
      valorUntMed: dto.valorUntMed,
      valorUntMedAuto: dto.valorUntMedAuto,
      undEstoque: dto.undEstoque,
      estoqueMinimo: dto.estoqueMinimo,
      categoria: dto.categoria,
      userId: dto.userId,
    });

    return await manager.save(Insumo, insumoToCreate);
  }
}
