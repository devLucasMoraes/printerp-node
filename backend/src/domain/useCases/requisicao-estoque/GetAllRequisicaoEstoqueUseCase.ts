import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { RequisicaoEstoqueRepository } from "../../repositories/RequisicaoEstoqueRepository";

export class GetAllRequisicaoEstoqueUseCase {
  constructor(
    private readonly requisicaoEstoqueRepository: RequisicaoEstoqueRepository
  ) {}

  async execute(): Promise<RequisicaoEstoque[]> {
    return await this.requisicaoEstoqueRepository.find();
  }
}
