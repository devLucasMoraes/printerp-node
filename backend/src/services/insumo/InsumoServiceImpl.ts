import { Insumo } from "../../domain/entities/Insumo";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { InsumoService } from "../../domain/services/InsumoService";
import { CreateInsumoUseCase } from "../../domain/useCases/insumo/CreateInsumoUseCase";
import { DeleteInsumoUseCase } from "../../domain/useCases/insumo/DeleteInsumoUseCase";
import { GetAllInsumoUseCase } from "../../domain/useCases/insumo/GetAllInsumoUseCase";
import { GetInsumoUseCase } from "../../domain/useCases/insumo/GetInsumoUseCase";
import { ListInsumoUseCase } from "../../domain/useCases/insumo/ListInsumoUseCase";
import { UpdateInsumoUseCase } from "../../domain/useCases/insumo/UpdateInsumoUseCase";
import {
  CreateInsumoDTO,
  UpdateInsumoDTO,
} from "../../http/validators/insumo.schemas";
import { SocketService } from "../socket/SocketService";

export class InsumoServiceImpl implements InsumoService {
  constructor(
    private readonly createInsumoUseCase: CreateInsumoUseCase,
    private readonly updateInsumoUseCase: UpdateInsumoUseCase,
    private readonly deleteInsumoUseCase: DeleteInsumoUseCase,
    private readonly getInsumoUseCase: GetInsumoUseCase,
    private readonly getAllInsumoUseCase: GetAllInsumoUseCase,
    private readonly listInsumoUseCase: ListInsumoUseCase
  ) {}
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Insumo>> {
    return await this.listInsumoUseCase.execute(pageRequest);
  }
  async list(): Promise<Insumo[]> {
    return await this.getAllInsumoUseCase.execute();
  }
  async show(id: number): Promise<Insumo> {
    return await this.getInsumoUseCase.execute(id);
  }
  async create(dto: CreateInsumoDTO): Promise<Insumo> {
    const insumo = await this.createInsumoUseCase.execute(dto);

    SocketService.getInstance().emitEntityChange("insumo", "create", insumo);

    return insumo;
  }
  async update(id: number, dto: UpdateInsumoDTO): Promise<Insumo> {
    const insumo = await this.updateInsumoUseCase.execute(id, dto);

    SocketService.getInstance().emitEntityChange("insumo", "update", insumo);

    return insumo;
  }
  async delete(id: number, userId: string): Promise<void> {
    await this.deleteInsumoUseCase.execute(id, userId);

    SocketService.getInstance().emitEntityChange("insumo", "delete");
  }
}
