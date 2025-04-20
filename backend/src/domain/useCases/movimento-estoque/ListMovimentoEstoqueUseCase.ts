import { MovimentoEstoque } from "../../entities/MovimentoEstoque";
import { movimentoEstoqueRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listMovimentoEstoqueUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<MovimentoEstoque>> {
    return await movimentoEstoqueRepository.findAllPaginated(pageRequest);
  },
};
