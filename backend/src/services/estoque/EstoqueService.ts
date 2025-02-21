import { Estoque } from "../../domain/entities/Estoque";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { EstoqueService } from "../../domain/services/EstoqueService";
import { ListEstoqueUseCase } from "../../domain/useCases/estoque/ListEstoqueEstoqueUseCase";

export class EstoqueServiceImpl implements EstoqueService {
  constructor(private readonly listEstoqueUseCase: ListEstoqueUseCase) {}
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Estoque>> {
    return await this.listEstoqueUseCase.execute(pageRequest);
  }
}
