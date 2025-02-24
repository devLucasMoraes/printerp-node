import { Armazem } from "../../domain/entities/Armazem";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { ArmazemService } from "../../domain/services/ArmazemService";
import { CreateArmazemUseCase } from "../../domain/useCases/armazem/CreateArmazemUseCase";
import { DeleteArmazemUseCase } from "../../domain/useCases/armazem/DeleteArmazemUseCase";
import { GetAllArmazemUseCase } from "../../domain/useCases/armazem/GetAllArmazemUseCase";
import { GetArmazemUseCase } from "../../domain/useCases/armazem/GetArmazemUseCase";
import { ListArmazemUseCase } from "../../domain/useCases/armazem/ListArmazemUseCase";
import { UpdateArmazemUseCase } from "../../domain/useCases/armazem/UpdateArmazemUseCase";
import {
  CreateArmazemDTO,
  UpdateArmazemDTO,
} from "../../http/validators/armazem.schema";
import { SocketService } from "../socket/SocketService";

export class ArmazemServiceImpl implements ArmazemService {
  constructor(
    private readonly createArmazemUseCase: CreateArmazemUseCase,
    private readonly updateArmazemUseCase: UpdateArmazemUseCase,
    private readonly deleteArmazemUseCase: DeleteArmazemUseCase,
    private readonly getArmazemUseCase: GetArmazemUseCase,
    private readonly getAllArmazemUseCase: GetAllArmazemUseCase,
    private readonly listArmazemUseCase: ListArmazemUseCase
  ) {}
  async list(): Promise<Armazem[]> {
    return await this.getAllArmazemUseCase.execute();
  }

  async create(dto: CreateArmazemDTO): Promise<Armazem> {
    const armazem = await this.createArmazemUseCase.execute(dto);

    SocketService.getInstance().emitEntityChange("armazem", "create", armazem);

    return armazem;
  }

  async update(id: number, dto: UpdateArmazemDTO): Promise<Armazem> {
    const armazem = await this.updateArmazemUseCase.execute(id, dto);

    SocketService.getInstance().emitEntityChange("armazem", "update", armazem);

    return armazem;
  }

  async delete(id: number): Promise<void> {
    await this.deleteArmazemUseCase.execute(id);
    SocketService.getInstance().emitEntityChange("armazem", "delete");
  }

  async show(id: number): Promise<Armazem> {
    return await this.getArmazemUseCase.execute(id);
  }

  async listPaginated(pageRequest?: PageRequest): Promise<Page<Armazem>> {
    return await this.listArmazemUseCase.execute(pageRequest);
  }
}
