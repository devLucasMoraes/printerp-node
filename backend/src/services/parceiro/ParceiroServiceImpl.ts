import { Parceiro } from "../../domain/entities/Parceiro";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { ParceiroService } from "../../domain/services/ParceiroService";
import { createParceiroUseCase } from "../../domain/useCases/parceiro/CreateParceiroUseCase";
import { deleteParceiroUseCase } from "../../domain/useCases/parceiro/DeleteParceiroUseCase";
import { getAllParceiroUseCase } from "../../domain/useCases/parceiro/GetAllParceiroUseCase";
import { getParceiroUseCase } from "../../domain/useCases/parceiro/GetParceiroUseCase";
import { listParceiroUseCase } from "../../domain/useCases/parceiro/ListParceiroUseCase";
import { updateParceiroUseCase } from "../../domain/useCases/parceiro/UpdateParceiroUseCase";

import {
  CreateParceiroDTO,
  UpdateParceiroDTO,
} from "../../http/validators/parceiro.schemas";
import { SocketService } from "../socket/SocketService";

export class ParceiroServiceImpl implements ParceiroService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Parceiro>> {
    return await listParceiroUseCase.execute(pageRequest);
  }
  async list(): Promise<Parceiro[]> {
    return await getAllParceiroUseCase.execute();
  }
  async show(id: number): Promise<Parceiro> {
    return await getParceiroUseCase.execute(id);
  }
  async create(dto: CreateParceiroDTO): Promise<Parceiro> {
    const parceiro = await createParceiroUseCase.execute(dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("parceiro", "create", parceiro);
    }

    return parceiro;
  }
  async update(id: number, dto: UpdateParceiroDTO): Promise<Parceiro> {
    const parceiro = await updateParceiroUseCase.execute(id, dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("parceiro", "update", parceiro);
    }

    return parceiro;
  }
  async delete(id: number, userId: string): Promise<void> {
    await deleteParceiroUseCase.execute(id, userId);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("parceiro", "delete");
    }
  }
}
