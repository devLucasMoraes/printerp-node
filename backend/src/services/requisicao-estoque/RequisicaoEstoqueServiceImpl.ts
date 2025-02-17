import { RequisicaoEstoque } from "../../domain/entities/RequisicaoEstoque";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { RequisicaoEstoqueService } from "../../domain/services/RequisicaoEstoqueService";
import { CreateRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/CreateRequisicaoEstoqueUseCase";
import { DeleteRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/DeleteRequisicaoEstoqueUseCase";
import { GetAllRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/GetAllRequisicaoEstoqueUseCase";
import { GetRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/GetRequisicaoEstoqueUseCase";
import { ListRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/ListRequisicaoEstoqueUseCase";
import { UpdateRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/UpdateRequisicaoEstoqueUseCase";
import {
  CreateRequisicaoEstoqueDTO,
  UpdateRequisicaoEstoqueDTO,
} from "../../http/validators/requisicaoEstoque.schemas";

export class RequisicaoEstoqueServiceImpl implements RequisicaoEstoqueService {
  constructor(
    private readonly createRequisicaoEstoqueUseCase: CreateRequisicaoEstoqueUseCase,
    private readonly updateRequisicaoEstoqueUseCase: UpdateRequisicaoEstoqueUseCase,
    private readonly deleteRequisicaoEstoqueUseCase: DeleteRequisicaoEstoqueUseCase,
    private readonly getRequisicaoEstoqueUseCase: GetRequisicaoEstoqueUseCase,
    private readonly getAllRequisicaoEstoqueUseCase: GetAllRequisicaoEstoqueUseCase,
    private readonly listRequisicaoEstoqueUseCase: ListRequisicaoEstoqueUseCase
  ) {}
  async list(): Promise<RequisicaoEstoque[]> {
    return await this.getAllRequisicaoEstoqueUseCase.execute();
  }

  async create(dto: CreateRequisicaoEstoqueDTO): Promise<RequisicaoEstoque> {
    return await this.createRequisicaoEstoqueUseCase.execute(dto);
  }

  async update(
    id: number,
    dto: UpdateRequisicaoEstoqueDTO
  ): Promise<RequisicaoEstoque> {
    return await this.updateRequisicaoEstoqueUseCase.execute(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.deleteRequisicaoEstoqueUseCase.execute(id);
  }

  async show(id: number): Promise<RequisicaoEstoque> {
    return await this.getRequisicaoEstoqueUseCase.execute(id);
  }

  async listPaginated(
    pageRequest?: PageRequest
  ): Promise<Page<RequisicaoEstoque>> {
    return await this.listRequisicaoEstoqueUseCase.execute(pageRequest);
  }
}
