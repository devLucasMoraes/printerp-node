import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { requisicaoEstoqueRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listRequisicaoEstoqueUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<RequisicaoEstoque>> {
    return await requisicaoEstoqueRepository.findAllPaginated(pageRequest);
  },
};
