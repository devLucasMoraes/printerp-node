import { MovimentoEstoque } from "../entities/MovimentoEstoque";
import { Page, PageRequest } from "../repositories/BaseRepository";

export interface MovimentoEstoqueService {
  listPaginated(pageRequest?: PageRequest): Promise<Page<MovimentoEstoque>>;
}
