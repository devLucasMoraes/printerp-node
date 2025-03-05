import { RequisicaoEstoque } from "../../domain/entities/RequisicaoEstoque";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { RequisicaoEstoqueService } from "../../domain/services/RequisicaoEstoqueService";
import { createRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/CreateRequisicaoEstoqueUseCase";
import { deleteRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/DeleteRequisicaoEstoqueUseCase";
import { getAllRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/GetAllRequisicaoEstoqueUseCase";
import { getRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/GetRequisicaoEstoqueUseCase";
import { listRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/ListRequisicaoEstoqueUseCase";
import { updateRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/UpdateRequisicaoEstoqueUseCase";

import {
  CreateRequisicaoEstoqueDTO,
  UpdateRequisicaoEstoqueDTO,
} from "../../http/validators/requisicaoEstoque.schemas";
import { SocketService } from "../socket/SocketService";

export class RequisicaoEstoqueServiceImpl implements RequisicaoEstoqueService {
  async list(): Promise<RequisicaoEstoque[]> {
    return await getAllRequisicaoEstoqueUseCase.execute();
  }

  async create(dto: CreateRequisicaoEstoqueDTO): Promise<RequisicaoEstoque> {
    const requisicao = await createRequisicaoEstoqueUseCase.execute(dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("requisicaoEstoque", "create", requisicao);
    }

    return requisicao;
  }

  async update(
    id: number,
    dto: UpdateRequisicaoEstoqueDTO
  ): Promise<RequisicaoEstoque> {
    const requisicao = await updateRequisicaoEstoqueUseCase.execute(id, dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("requisicaoEstoque", "update", requisicao);
    }

    return requisicao;
  }

  async delete(id: number): Promise<void> {
    await deleteRequisicaoEstoqueUseCase.execute(id);
    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("requisicaoEstoque", "delete");
    }
  }

  async show(id: number): Promise<RequisicaoEstoque> {
    return await getRequisicaoEstoqueUseCase.execute(id);
  }

  async listPaginated(
    pageRequest?: PageRequest
  ): Promise<Page<RequisicaoEstoque>> {
    return await listRequisicaoEstoqueUseCase.execute(pageRequest);
  }
}
