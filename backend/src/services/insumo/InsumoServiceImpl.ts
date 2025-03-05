import { Insumo } from "../../domain/entities/Insumo";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { InsumoService } from "../../domain/services/InsumoService";
import { createInsumoUseCase } from "../../domain/useCases/insumo/CreateInsumoUseCase";
import { deleteInsumoUseCase } from "../../domain/useCases/insumo/DeleteInsumoUseCase";
import { getAllInsumoUseCase } from "../../domain/useCases/insumo/GetAllInsumoUseCase";
import { getInsumoUseCase } from "../../domain/useCases/insumo/GetInsumoUseCase";
import { listInsumoUseCase } from "../../domain/useCases/insumo/ListInsumoUseCase";
import { updateInsumoUseCase } from "../../domain/useCases/insumo/UpdateInsumoUseCase";

import {
  CreateInsumoDTO,
  UpdateInsumoDTO,
} from "../../http/validators/insumo.schemas";
import { SocketService } from "../socket/SocketService";

export class InsumoServiceImpl implements InsumoService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Insumo>> {
    return await listInsumoUseCase.execute(pageRequest);
  }
  async list(): Promise<Insumo[]> {
    return await getAllInsumoUseCase.execute();
  }
  async show(id: number): Promise<Insumo> {
    return await getInsumoUseCase.execute(id);
  }
  async create(dto: CreateInsumoDTO): Promise<Insumo> {
    const insumo = await createInsumoUseCase.execute(dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("insumo", "create", insumo);
    }

    return insumo;
  }
  async update(id: number, dto: UpdateInsumoDTO): Promise<Insumo> {
    const insumo = await updateInsumoUseCase.execute(id, dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("insumo", "update", insumo);
    }

    return insumo;
  }
  async delete(id: number, userId: string): Promise<void> {
    await deleteInsumoUseCase.execute(id, userId);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("insumo", "delete");
    }
  }
}
