import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { Page, PageRequest } from "../../repositories/BaseRepository";
import { RequisicaoEstoqueRepository } from "../../repositories/RequisicaoEstoqueRepository";

export class ListRequisicaoEstoqueUseCase {
  constructor(
    private readonly requisicaoEstoqueRepository: RequisicaoEstoqueRepository
  ) {}

  async execute(pageRequest?: PageRequest): Promise<Page<RequisicaoEstoque>> {
    return await this.requisicaoEstoqueRepository.findAllPaginated(pageRequest);
  }
}
