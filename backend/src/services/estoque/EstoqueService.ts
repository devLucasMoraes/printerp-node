import { Estoque } from "../../domain/entities/Estoque";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { EstoqueService } from "../../domain/services/EstoqueService";
import { adjustEstoqueUseCase } from "../../domain/useCases/estoque/AdjustEstoqueUseCase";
import { listEstoqueUseCase } from "../../domain/useCases/estoque/ListEstoqueEstoqueUseCase";
import { AdjustEstoqueDTO } from "../../http/validators/estoque.schema";
import { SocketService } from "../socket/SocketService";

export class EstoqueServiceImpl implements EstoqueService {
  async adjust(id: number, dto: AdjustEstoqueDTO): Promise<Estoque> {
    const estoque = await adjustEstoqueUseCase.execute(id, dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("estoque", "update", estoque);
    }

    return estoque;
  }
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Estoque>> {
    return await listEstoqueUseCase.execute(pageRequest);
  }
}
