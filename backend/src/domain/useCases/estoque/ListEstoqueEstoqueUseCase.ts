import { Estoque } from "../../entities/Estoque";
import { Page, PageRequest } from "../../repositories/BaseRepository";
import { EstoqueRepository } from "../../repositories/EstoqueRepository";

export class ListEstoqueUseCase {
  constructor(private readonly estoqueRepository: EstoqueRepository) {}

  async execute(pageRequest?: PageRequest): Promise<Page<Estoque>> {
    return await this.estoqueRepository.findAllPaginated(pageRequest);
  }
}
