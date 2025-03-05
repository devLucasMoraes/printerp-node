import { NotFoundError } from "../../../shared/errors";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { requisicaoEstoqueRepository } from "../../repositories";

export const getRequisicaoEstoqueUseCase = {
  async execute(id: number): Promise<RequisicaoEstoque> {
    const requisicao = await requisicaoEstoqueRepository.findOneWithRelations(
      id
    );

    if (!requisicao) {
      throw new NotFoundError("RequisicaoEstoque not found");
    }

    return requisicao;
  },
};
