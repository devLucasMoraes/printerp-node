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
    return await this.createArmazemUseCase.execute(dto);
  }

  async update(id: number, dto: UpdateArmazemDTO): Promise<Armazem> {
    return await this.updateArmazemUseCase.execute(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.deleteArmazemUseCase.execute(id);
  }

  async show(id: number): Promise<Armazem> {
    return await this.getArmazemUseCase.execute(id);
  }

  async listPaginated(pageRequest?: PageRequest): Promise<Page<Armazem>> {
    return await this.listArmazemUseCase.execute(pageRequest);
  }
}
