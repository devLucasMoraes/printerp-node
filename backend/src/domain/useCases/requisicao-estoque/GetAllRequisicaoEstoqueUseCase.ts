import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { requisicaoEstoqueRepository } from "../../repositories";

export const getAllRequisicaoEstoqueUseCase = {
  async execute(): Promise<RequisicaoEstoque[]> {
    return await requisicaoEstoqueRepository.find({
      relations: {
        itens: {
          insumo: true,
        },
        requisitante: true,
        setor: true,
        armazem: true,
      },
    });
  },
};
