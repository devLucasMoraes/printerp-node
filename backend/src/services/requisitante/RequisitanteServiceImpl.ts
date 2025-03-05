import { Requisitante } from "../../domain/entities/Requisitante";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { RequisitanteService } from "../../domain/services/RequisitanteService";
import { createRequisitanteUseCase } from "../../domain/useCases/requisitante/CreateRequisitanteUseCase";
import { deleteRequisitanteUseCase } from "../../domain/useCases/requisitante/DeleteRequisitanteUseCase";
import { getAllRequisitanteUseCase } from "../../domain/useCases/requisitante/GetAllRequisitanteUseCase";
import { getRequisitanteUseCase } from "../../domain/useCases/requisitante/GetRequisitanteUseCase";
import { listRequisitanteUseCase } from "../../domain/useCases/requisitante/ListEquipamentoUseCase";
import { updateRequisitanteUseCase } from "../../domain/useCases/requisitante/UpdateEquipamentoUseCase";
import {
  CreateRequisitanteDTO,
  UpdateRequisitanteDTO,
} from "../../http/validators/requisitante.schemas";
import { SocketService } from "../socket/SocketService";

export class RequisitanteServiceImpl implements RequisitanteService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Requisitante>> {
    return await listRequisitanteUseCase.execute(pageRequest);
  }
  async list(): Promise<Requisitante[]> {
    return await getAllRequisitanteUseCase.execute();
  }
  async show(id: number): Promise<Requisitante> {
    return await getRequisitanteUseCase.execute(id);
  }
  async create(dto: CreateRequisitanteDTO): Promise<Requisitante> {
    const requisitante = await createRequisitanteUseCase.execute(dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("requisitante", "create", requisitante);
    }

    return requisitante;
  }
  async update(id: number, dto: UpdateRequisitanteDTO): Promise<Requisitante> {
    const requisitante = await updateRequisitanteUseCase.execute(id, dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("requisitante", "update", requisitante);
    }

    return requisitante;
  }
  async delete(id: number, userId: string): Promise<void> {
    await deleteRequisitanteUseCase.execute(id, userId);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("requisitante", "delete");
    }
  }
}
