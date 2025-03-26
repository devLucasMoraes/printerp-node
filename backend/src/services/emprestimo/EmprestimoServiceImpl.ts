import { Emprestimo } from "../../domain/entities/Emprestimo";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { EmprestimoService } from "../../domain/services/EmprestimoService";
import { createEmprestimoUseCase } from "../../domain/useCases/emprestimo/CreateEmprestimoUseCase";
import { getAllEmprestimoUseCase } from "../../domain/useCases/emprestimo/GetAllEmprestimoUseCase";
import { getEmprestimoUseCase } from "../../domain/useCases/emprestimo/GetEmprestimoUseCase";
import { listEmprestimoUseCase } from "../../domain/useCases/emprestimo/ListEmprestimoUseCase";
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
  update(id: number, dto: UpdateEmprestimoDTO): Promise<Emprestimo> {
    throw new Error("Method not implemented.");
  }
  delete(id: number, userID?: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
