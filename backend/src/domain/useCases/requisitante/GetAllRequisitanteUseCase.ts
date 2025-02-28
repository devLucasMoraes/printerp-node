import { Requisitante } from "../../entities/Requisitante";
import { RequisitanteRepository } from "../../repositories/RequisitanteRepository";

export class GetAllRequisitanteUseCase {
  constructor(
    private readonly requisitanteRepository: RequisitanteRepository
  ) {}

  async execute(): Promise<Requisitante[]> {
    return await this.requisitanteRepository.find();
  }
}
