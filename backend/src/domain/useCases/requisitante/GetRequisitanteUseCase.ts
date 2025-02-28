import { NotFoundError } from "../../../shared/errors";
import { Requisitante } from "../../entities/Requisitante";
import { RequisitanteRepository } from "../../repositories/RequisitanteRepository";

export class GetRequisitanteUseCase {
  constructor(
    private readonly requisitanteRepository: RequisitanteRepository
  ) {}

  async execute(id: number): Promise<Requisitante> {
    const requisitante = await this.requisitanteRepository.findOneBy({ id });

    if (!requisitante) {
      throw new NotFoundError("Requisitante não encontrado");
    }

    return requisitante;
  }
}
