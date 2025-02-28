import { EntityManager } from "typeorm";
import { CreateRequisitanteDTO } from "../../../http/validators/requisitante.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Requisitante } from "../../entities/Requisitante";
import { RequisitanteRepository } from "../../repositories/RequisitanteRepository";

export class CreateRequisitanteUseCase {
  constructor(
    private readonly requisitanteRepository: RequisitanteRepository
  ) {}

  async execute(dto: CreateRequisitanteDTO): Promise<Requisitante> {
    return await this.requisitanteRepository.manager.transaction(
      async (manager) => {
        await this.validate(dto, manager);
        const requisitante = await this.createRequisitante(dto, manager);
        return requisitante;
      }
    );
  }

  private async validate(
    dto: CreateRequisitanteDTO,
    manager: EntityManager
  ): Promise<void> {
    const requisitante = await manager.getRepository(Requisitante).findOne({
      where: { nome: dto.nome },
      withDeleted: true,
    });

    if (requisitante && requisitante.ativo === true) {
      throw new BadRequestError(
        `Requisitante "${requisitante.nome}" já cadastrado`
      );
    }

    if (requisitante && requisitante.ativo === false) {
      throw new BadRequestError(
        `Requisitante "${requisitante.nome}" já cadastrado e desativado`
      );
    }
  }

  private async createRequisitante(
    dto: CreateRequisitanteDTO,
    manager: EntityManager
  ): Promise<Requisitante> {
    const requisitanteToCreate = this.requisitanteRepository.create({
      nome: dto.nome,
      fone: dto.fone,
      userId: dto.userId,
    });

    return await manager.save(Requisitante, requisitanteToCreate);
  }
}
