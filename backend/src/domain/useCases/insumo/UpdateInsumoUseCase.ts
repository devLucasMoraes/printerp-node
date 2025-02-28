import { EntityManager } from "typeorm";
import { UpdateInsumoDTO } from "../../../http/validators/insumo.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Insumo } from "../../entities/Insumo";
import { InsumoRepository } from "../../repositories/InsumoRepository";

export class UpdateInsumoUseCase {
  constructor(private readonly insumoRepository: InsumoRepository) {}

  async execute(id: number, dto: UpdateInsumoDTO): Promise<Insumo> {
    return await this.insumoRepository.manager.transaction(async (manager) => {
      const insumoToUpdate = await this.findInsumoToUpdate(id, manager);
      await this.validate(id, dto, manager);
      const insumo = await this.update(insumoToUpdate, dto, manager);
      return insumo;
    });
  }

  private async findInsumoToUpdate(
    id: number,
    manager: EntityManager
  ): Promise<Insumo> {
    const insumo = await manager.findOne(Insumo, {
      where: { id },
    });

    if (!insumo) {
      throw new BadRequestError("Insumo não encontrado");
    }

    return insumo;
  }

  private async validate(
    id: number,
    dto: UpdateInsumoDTO,
    manager: EntityManager
  ): Promise<void> {
    const insumo = await manager.getRepository(Insumo).findOne({
      where: { descricao: dto.descricao },
      withDeleted: true,
    });

    if (id !== dto.id) {
      throw new BadRequestError("Id do insumo não pode ser alterado");
    }

    if (insumo && insumo.ativo === true && insumo.id !== dto.id) {
      throw new BadRequestError(`Insumo "${insumo.descricao}" já cadastrado`);
    }

    if (insumo && insumo.ativo === false) {
      throw new BadRequestError(
        `Insumo "${insumo.descricao}" já cadastrado e desativado`
      );
    }
  }

  private async update(
    insumoToUpdate: Insumo,
    dto: UpdateInsumoDTO,
    manager: EntityManager
  ): Promise<Insumo> {
    const insumoDTO = this.insumoRepository.create({
      id: dto.id,
      descricao: dto.descricao,
      valorUntMed: dto.valorUntMed,
      valorUntMedAuto: dto.valorUntMedAuto,
      undEstoque: dto.undEstoque,
      estoqueMinimo: dto.estoqueMinimo,
      categoria: dto.categoria,
      userId: dto.userId,
    });

    const insumo = this.insumoRepository.merge(insumoToUpdate, insumoDTO);

    return await manager.save(Insumo, insumo);
  }
}
