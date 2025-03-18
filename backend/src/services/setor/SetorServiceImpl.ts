import { Setor } from "../../domain/entities/Setor";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { SetorService } from "../../domain/services/SetorService";
import { createSetorUseCase } from "../../domain/useCases/setor/CreateSetorUseCase";
import { deleteSetorUseCase } from "../../domain/useCases/setor/DeleteSetorUseCase";
import { getAllSetorUseCase } from "../../domain/useCases/setor/GetAllSetorUseCase";
import { getSetorUseCase } from "../../domain/useCases/setor/GetSetorUseCase";
import { listSetorUseCase } from "../../domain/useCases/setor/ListSetorUseCase";
import { updateSetorUseCase } from "../../domain/useCases/setor/UpdateSetorUseCase";
import {
  CreateSetorDTO,
  UpdateSetorDTO,
} from "../../http/validators/setor.schemas";
import { SocketService } from "../socket/SocketService";

export class SetorServiceImpl implements SetorService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Setor>> {
    return await listSetorUseCase.execute(pageRequest);
  }
  async list(): Promise<Setor[]> {
    return await getAllSetorUseCase.execute();
  }
  async show(id: number): Promise<Setor> {
    return await getSetorUseCase.execute(id);
  }
  async create(dto: CreateSetorDTO): Promise<Setor> {
    const setor = await createSetorUseCase.execute(dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("setor", "create", setor);
    }
    return setor;
  }
  async update(id: number, dto: UpdateSetorDTO): Promise<Setor> {
    const setor = await updateSetorUseCase.execute(id, dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("setor", "update", setor);
    }

    return setor;
  }
  async delete(id: number, userId: string): Promise<void> {
    await deleteSetorUseCase.execute(id, userId);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("setor", "delete");
    }
  }
}
