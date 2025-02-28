import { Requisitante } from "../../domain/entities/Requisitante";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { RequisitanteService } from "../../domain/services/RequisitanteService";
import { CreateRequisitanteUseCase } from "../../domain/useCases/requisitante/CreateRequisitanteUseCase";
import { DeleteRequisitanteUseCase } from "../../domain/useCases/requisitante/DeleteRequisitanteUseCase";
import { GetAllRequisitanteUseCase } from "../../domain/useCases/requisitante/GetAllRequisitanteUseCase";
import { GetRequisitanteUseCase } from "../../domain/useCases/requisitante/GetRequisitanteUseCase";
import { ListRequisitanteUseCase } from "../../domain/useCases/requisitante/ListEquipamentoUseCase";
import { UpdateRequisitanteUseCase } from "../../domain/useCases/requisitante/UpdateEquipamentoUseCase";
import {
  CreateRequisitanteDTO,
  UpdateRequisitanteDTO,
} from "../../http/validators/requisitante.schemas";
import { SocketService } from "../socket/SocketService";

export class RequisitanteServiceImpl implements RequisitanteService {
  constructor(
    private readonly createRequisitanteUseCase: CreateRequisitanteUseCase,
    private readonly updateRequisitanteUseCase: UpdateRequisitanteUseCase,
    private readonly deleteRequisitanteUseCase: DeleteRequisitanteUseCase,
    private readonly getRequisitanteUseCase: GetRequisitanteUseCase,
    private readonly getAllRequisitanteUseCase: GetAllRequisitanteUseCase,
    private readonly listRequisitanteUseCase: ListRequisitanteUseCase
  ) {}
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Requisitante>> {
    return await this.listRequisitanteUseCase.execute(pageRequest);
  }
  async list(): Promise<Requisitante[]> {
    return await this.getAllRequisitanteUseCase.execute();
  }
  async show(id: number): Promise<Requisitante> {
    return await this.getRequisitanteUseCase.execute(id);
  }
  async create(dto: CreateRequisitanteDTO): Promise<Requisitante> {
    const requisitante = await this.createRequisitanteUseCase.execute(dto);

    SocketService.getInstance().emitEntityChange(
      "requisitante",
      "create",
      requisitante
    );

    return requisitante;
  }
  async update(id: number, dto: UpdateRequisitanteDTO): Promise<Requisitante> {
    const requisitante = await this.updateRequisitanteUseCase.execute(id, dto);

    SocketService.getInstance().emitEntityChange(
      "requisitante",
      "update",
      requisitante
    );

    return requisitante;
  }
  async delete(id: number, userId: string): Promise<void> {
    await this.deleteRequisitanteUseCase.execute(id, userId);

    SocketService.getInstance().emitEntityChange("requisitante", "delete");
  }
}
