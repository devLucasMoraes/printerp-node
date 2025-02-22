import { AdjustEstoqueDTO } from "../../http/validators/estoque.schema";
import { Estoque } from "../entities/Estoque";
import { Page, PageRequest } from "../repositories/BaseRepository";

export interface EstoqueService {
  listPaginated(pageRequest?: PageRequest): Promise<Page<Estoque>>;
  adjust(id: number, dto: AdjustEstoqueDTO): Promise<Estoque>;
}
