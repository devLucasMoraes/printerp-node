import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { RequisitanteService } from "../../domain/services/RequisitanteService";

export class RequisitanteServiceImpl implements RequisitanteService {
  listPaginated(pageRequest?: PageRequest): Promise<Page<RequisitanteService>> {
    throw new Error("Method not implemented.");
  }
  list(): Promise<RequisitanteService[]> {
    throw new Error("Method not implemented.");
  }
  show(id: number): Promise<RequisitanteService> {
    throw new Error("Method not implemented.");
  }
  create(entity: RequisitanteService): Promise<RequisitanteService> {
    throw new Error("Method not implemented.");
  }
  update(
    id: number,
    entity: RequisitanteService
  ): Promise<RequisitanteService> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
