import { Emprestimo } from "../../entities/Emprestimo";
import { emprestimoRepository } from "../../repositories";

export const getAllEmprestimoUseCase = {
  async execute(): Promise<Emprestimo[]> {
    return await emprestimoRepository.find({
      relations: {
        itens: {
          insumo: true,
          devolucaoItens: {
            insumo: true,
          },
        },
        parceiro: true,
        armazem: true,
      },
    });
  },
};
