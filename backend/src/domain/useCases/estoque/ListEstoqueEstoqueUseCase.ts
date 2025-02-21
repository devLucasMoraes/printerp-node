import { Estoque } from "../../entities/Estoque";
import { Page, PageRequest } from "../../repositories/BaseRepository";
import { EstoqueRepository } from "../../repositories/EstoqueRepository";

export class ListEstoqueUseCase {
  constructor(
    private readonly requisicaoEstoqueRepository: EstoqueRepository
  ) {}

  async execute(pageRequest?: PageRequest): Promise<Page<Estoque>> {
    return await this.requisicaoEstoqueRepository.findAllPaginated(pageRequest);
  }
}
