import { Insumo } from "../../entities/Insumo";
import { Page, PageRequest } from "../../repositories/BaseRepository";
import { InsumoRepository } from "../../repositories/InsumoRepository";

export class ListInsumoUseCase {
  constructor(private readonly insumoRepository: InsumoRepository) {}

  async execute(pageRequest?: PageRequest): Promise<Page<Insumo>> {
    return await this.insumoRepository.findAllPaginated(pageRequest);
  }
}
