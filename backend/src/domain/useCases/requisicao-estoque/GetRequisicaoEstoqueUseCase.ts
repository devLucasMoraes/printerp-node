import { NotFoundError } from "../../../shared/errors";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { RequisicaoEstoqueRepository } from "../../repositories/RequisicaoEstoqueRepository";

export class GetRequisicaoEstoqueUseCase {
  constructor(
    private readonly requisicaoEstoqueRepository: RequisicaoEstoqueRepository
  ) {}

  async execute(id: number): Promise<RequisicaoEstoque> {
    const requisicao =
      await this.requisicaoEstoqueRepository.findOneWithRelations(id);

    if (!requisicao) {
      throw new NotFoundError("RequisicaoEstoque not found");
    }

    return requisicao;
  }
}
