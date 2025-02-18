import { Armazem } from "../../entities/Armazem";
import { ArmazemRepository } from "../../repositories/ArmazemRepository";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export class ListArmazemUseCase {
  constructor(private readonly armazemRepository: ArmazemRepository) {}

  async execute(pageRequest?: PageRequest): Promise<Page<Armazem>> {
    return await this.armazemRepository.findAllPaginated(pageRequest);
  }
}
