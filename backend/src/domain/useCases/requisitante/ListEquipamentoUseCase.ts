import { Requisitante } from "../../entities/Requisitante";
import { Page, PageRequest } from "../../repositories/BaseRepository";
import { RequisitanteRepository } from "../../repositories/RequisitanteRepository";

export class ListRequisitanteUseCase {
  constructor(
    private readonly requisitanteRepository: RequisitanteRepository
  ) {}

  async execute(pageRequest?: PageRequest): Promise<Page<Requisitante>> {
    return await this.requisitanteRepository.findAllPaginated(pageRequest);
  }
}
