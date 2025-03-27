import { Emprestimo } from "../../domain/entities/Emprestimo";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { EmprestimoService } from "../../domain/services/EmprestimoService";
import { createEmprestimoUseCase } from "../../domain/useCases/emprestimo/CreateEmprestimoUseCase";
import { deleteEmprestimoUseCase } from "../../domain/useCases/emprestimo/DeleteEmprestimoUseCase";
import { getAllEmprestimoUseCase } from "../../domain/useCases/emprestimo/GetAllEmprestimoUseCase";
import { getEmprestimoUseCase } from "../../domain/useCases/emprestimo/GetEmprestimoUseCase";
import { listEmprestimoUseCase } from "../../domain/useCases/emprestimo/ListEmprestimoUseCase";
import { updateEmprestimoUseCase } from "../../domain/useCases/emprestimo/UpdateEmprestimoUseCase";
import {
  CreateEmprestimoDTO,
  UpdateEmprestimoDTO,
} from "../../http/validators/emprestimo.schema";
import { SocketService } from "../socket/SocketService";

export class EmprestimoServiceImpl implements EmprestimoService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Emprestimo>> {
    return await listEmprestimoUseCase.execute(pageRequest);
  }
  async list(): Promise<Emprestimo[]> {
    return await getAllEmprestimoUseCase.execute();
  }
  async show(id: number): Promise<Emprestimo> {
    return await getEmprestimoUseCase.execute(id);
  }
  async create(dto: CreateEmprestimoDTO): Promise<Emprestimo> {
    const emprestimo = await createEmprestimoUseCase.execute(dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("emprestimo", "create", emprestimo);
    }

    return emprestimo;
  }
  async update(id: number, dto: UpdateEmprestimoDTO): Promise<Emprestimo> {
    const emprestimo = await updateEmprestimoUseCase.execute(id, dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("emprestimo", "update", emprestimo);
    }

    return emprestimo;
  }
  async delete(id: number, userID?: string): Promise<void> {
    await deleteEmprestimoUseCase.execute(id);
    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("emprestimo", "delete");
    }
  }
}
