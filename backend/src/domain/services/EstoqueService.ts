import { Estoque } from "../entities/Estoque";
import { Page, PageRequest } from "../repositories/BaseRepository";

export interface EstoqueService {
  listPaginated(pageRequest?: PageRequest): Promise<Page<Estoque>>;
}
