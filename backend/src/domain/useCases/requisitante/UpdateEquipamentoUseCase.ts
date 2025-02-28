import { EntityManager } from "typeorm";
import { UpdateRequisitanteDTO } from "../../../http/validators/requisitante.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Requisitante } from "../../entities/Requisitante";
import { RequisitanteRepository } from "../../repositories/RequisitanteRepository";

export class UpdateRequisitanteUseCase {
  constructor(
    private readonly requisitanteRepository: RequisitanteRepository
  ) {}

  async execute(id: number, dto: UpdateRequisitanteDTO): Promise<Requisitante> {
    return await this.requisitanteRepository.manager.transaction(
      async (manager) => {
        const requisitanteToUpdate = await this.findRequisitanteToUpdate(
          id,
          manager
        );
        await this.validate(id, dto, manager);
        const requisitante = await this.update(
          requisitanteToUpdate,
          dto,
          manager
        );
        return requisitante;
      }
    );
  }

  private async findRequisitanteToUpdate(
    id: number,
    manager: EntityManager
  ): Promise<Requisitante> {
    const requisitante = await manager.findOne(Requisitante, {
      where: { id },
    });

    if (!requisitante) {
      throw new BadRequestError("Requisitante não encontrado");
    }

    return requisitante;
  }

  private async validate(
    id: number,
    dto: UpdateRequisitanteDTO,
    manager: EntityManager
  ): Promise<void> {
    const requisitante = await manager.getRepository(Requisitante).findOne({
      where: { nome: dto.nome },
      withDeleted: true,
    });

    if (id !== dto.id) {
      throw new BadRequestError("Id do requisitante não pode ser alterado");
    }

    if (
      requisitante &&
      requisitante.ativo === true &&
      requisitante.id !== dto.id
    ) {
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

  private async update(
    requisitanteToUpdate: Requisitante,
    dto: UpdateRequisitanteDTO,
    manager: EntityManager
  ): Promise<Requisitante> {
    const requisitanteDTO = this.requisitanteRepository.create({
      id: dto.id,
      nome: dto.nome,
      fone: dto.fone,
      userId: dto.userId,
    });

    const requisitante = this.requisitanteRepository.merge(
      requisitanteToUpdate,
      requisitanteDTO
    );

    return await manager.save(Requisitante, requisitante);
  }
}
