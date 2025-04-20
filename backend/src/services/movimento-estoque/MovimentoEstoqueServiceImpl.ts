import { MovimentoEstoque } from "../../domain/entities/MovimentoEstoque";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { MovimentoEstoqueService } from "../../domain/services/MovimentoEstoqueService";
import { listMovimentoEstoqueUseCase } from "../../domain/useCases/movimento-estoque/ListMovimentoEstoqueUseCase";

export class MovimentoEstoqueServiceImpl implements MovimentoEstoqueService {
  async listPaginated(
    pageRequest?: PageRequest
  ): Promise<Page<MovimentoEstoque>> {
    return await listMovimentoEstoqueUseCase.execute(pageRequest);
  }
}
