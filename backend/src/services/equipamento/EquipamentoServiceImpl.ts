import { Equipamento } from "../../domain/entities/Equipamento";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { EquipamentoService } from "../../domain/services/EquipamentoService";
import { createEquipamentoUseCase } from "../../domain/useCases/equipamento/CreateEquipamentoUseCase";
import { deleteEquipamentoUseCase } from "../../domain/useCases/equipamento/DeleteEquipamentoUseCase";
import { getAllEquipamentoUseCase } from "../../domain/useCases/equipamento/GetAllEquipamentoUseCase";
import { getEquipamentoUseCase } from "../../domain/useCases/equipamento/GetEquipamentoUseCase";
import { listEquipamentoUseCase } from "../../domain/useCases/equipamento/ListEquipamentoUseCase";
import { updateEquipamentoUseCase } from "../../domain/useCases/equipamento/UpdateEquipamentoUseCase";
import {
  CreateEquipamentoDTO,
  UpdateEquipamentoDTO,
} from "../../http/validators/equipamento.schemas";
import { SocketService } from "../socket/SocketService";

export class EquipamentoServiceImpl implements EquipamentoService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Equipamento>> {
    return await listEquipamentoUseCase.execute(pageRequest);
  }
  async list(): Promise<Equipamento[]> {
    return await getAllEquipamentoUseCase.execute();
  }
  async show(id: number): Promise<Equipamento> {
    return await getEquipamentoUseCase.execute(id);
  }
  async create(dto: CreateEquipamentoDTO): Promise<Equipamento> {
    const equipamento = await createEquipamentoUseCase.execute(dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("equipamento", "create", equipamento);
    }
    return equipamento;
  }
  async update(id: number, dto: UpdateEquipamentoDTO): Promise<Equipamento> {
    const equipamento = await updateEquipamentoUseCase.execute(id, dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("equipamento", "update", equipamento);
    }

    return equipamento;
  }
  async delete(id: number, userId: string): Promise<void> {
    await deleteEquipamentoUseCase.execute(id, userId);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("equipamento", "delete");
    }
  }
}
