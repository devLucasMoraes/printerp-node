import { Emprestimo } from "../../entities/Emprestimo";
import { emprestimoRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listEmprestimoUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<Emprestimo>> {
    return await emprestimoRepository.findAllPaginated(pageRequest);
  },
};
