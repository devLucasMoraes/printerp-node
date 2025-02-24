import { Estoque } from "../../domain/entities/Estoque";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { EstoqueService } from "../../domain/services/EstoqueService";
import { AdjustEstoqueUseCase } from "../../domain/useCases/estoque/AdjustEstoqueUseCase";
import { ListEstoqueUseCase } from "../../domain/useCases/estoque/ListEstoqueEstoqueUseCase";
import { AdjustEstoqueDTO } from "../../http/validators/estoque.schema";
import { SocketService } from "../socket/SocketService";

export class EstoqueServiceImpl implements EstoqueService {
  constructor(
    private readonly listEstoqueUseCase: ListEstoqueUseCase,
    private readonly adjustEstoqueUseCase: AdjustEstoqueUseCase
  ) {}
  async adjust(id: number, dto: AdjustEstoqueDTO): Promise<Estoque> {
    const estoque = await this.adjustEstoqueUseCase.execute(id, dto);

    SocketService.getInstance().emitEntityChange("estoque", "update", estoque);

    return estoque;
  }
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Estoque>> {
    return await this.listEstoqueUseCase.execute(pageRequest);
  }
}
