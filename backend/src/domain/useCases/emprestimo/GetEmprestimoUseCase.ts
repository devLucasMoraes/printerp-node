import { NotFoundError } from "../../../shared/errors";
import { Emprestimo } from "../../entities/Emprestimo";
import { emprestimoRepository } from "../../repositories";

export const getEmprestimoUseCase = {
  async execute(id: number): Promise<Emprestimo> {
    const emprestimo = await emprestimoRepository.findOneWithRelations(id);

    if (!emprestimo) {
      throw new NotFoundError("Empréstimo não encontrado");
    }

    return emprestimo;
  },
};
