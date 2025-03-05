import { Armazem } from "../../domain/entities/Armazem";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { ArmazemService } from "../../domain/services/ArmazemService";
import { createArmazemUseCase } from "../../domain/useCases/armazem/CreateArmazemUseCase";
import { deleteArmazemUseCase } from "../../domain/useCases/armazem/DeleteArmazemUseCase";
import { getAllArmazemUseCase } from "../../domain/useCases/armazem/GetAllArmazemUseCase";
import { getArmazemUseCase } from "../../domain/useCases/armazem/GetArmazemUseCase";
import { listArmazemUseCase } from "../../domain/useCases/armazem/ListArmazemUseCase";
import { updateArmazemUseCase } from "../../domain/useCases/armazem/UpdateArmazemUseCase";

import {
  CreateArmazemDTO,
  UpdateArmazemDTO,
} from "../../http/validators/armazem.schema";
import { SocketService } from "../socket/SocketService";

export class ArmazemServiceImpl implements ArmazemService {
  async list(): Promise<Armazem[]> {
    return await getAllArmazemUseCase.execute();
  }

  async create(dto: CreateArmazemDTO): Promise<Armazem> {
    const armazem = await createArmazemUseCase.execute(dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("armazem", "create", armazem);
    }

    return armazem;
  }

  async update(id: number, dto: UpdateArmazemDTO): Promise<Armazem> {
    const armazem = await updateArmazemUseCase.execute(id, dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("armazem", "update", armazem);
    }

    return armazem;
  }

  async delete(id: number, userId: string): Promise<void> {
    await deleteArmazemUseCase.execute(id, userId);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("armazem", "delete");
    }
  }

  async show(id: number): Promise<Armazem> {
    return await getArmazemUseCase.execute(id);
  }

  async listPaginated(pageRequest?: PageRequest): Promise<Page<Armazem>> {
    return await listArmazemUseCase.execute(pageRequest);
  }
}
