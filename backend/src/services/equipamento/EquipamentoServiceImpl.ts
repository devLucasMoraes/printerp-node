import { Equipamento } from "../../domain/entities/Equipamento";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { EquipamentoService } from "../../domain/services/EquipamentoService";
import { CreateEquipamentoUseCase } from "../../domain/useCases/equipamento/CreateEquipamentoUseCase";
import { DeleteEquipamentoUseCase } from "../../domain/useCases/equipamento/DeleteEquipamentoUseCase";
import { GetAllEquipamentoUseCase } from "../../domain/useCases/equipamento/GetAllEquipamentoUseCase";
import { GetEquipamentoUseCase } from "../../domain/useCases/equipamento/GetEquipamentoUseCase";
import { ListEquipamentoUseCase } from "../../domain/useCases/equipamento/ListEquipamentoUseCase";
import { UpdateEquipamentoUseCase } from "../../domain/useCases/equipamento/UpdateEquipamentoUseCase";
import {
  CreateEquipamentoDTO,
  UpdateEquipamentoDTO,
} from "../../http/validators/equipamento.schemas";
import { SocketService } from "../socket/SocketService";

export class EquipamentoServiceImpl implements EquipamentoService {
  constructor(
    private readonly createEquipamentoUseCase: CreateEquipamentoUseCase,
    private readonly updateEquipamentoUseCase: UpdateEquipamentoUseCase,
    private readonly deleteEquipamentoUseCase: DeleteEquipamentoUseCase,
    private readonly getEquipamentoUseCase: GetEquipamentoUseCase,
    private readonly getAllEquipamentoUseCase: GetAllEquipamentoUseCase,
    private readonly listEquipamentoUseCase: ListEquipamentoUseCase
  ) {}
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Equipamento>> {
    return await this.listEquipamentoUseCase.execute(pageRequest);
  }
  async list(): Promise<Equipamento[]> {
    return await this.getAllEquipamentoUseCase.execute();
  }
  async show(id: number): Promise<Equipamento> {
    return await this.getEquipamentoUseCase.execute(id);
  }
  async create(dto: CreateEquipamentoDTO): Promise<Equipamento> {
    const equipamento = await this.createEquipamentoUseCase.execute(dto);

    SocketService.getInstance().emitEntityChange(
      "equipamento",
      "create",
      equipamento
    );

    return equipamento;
  }
  async update(id: number, dto: UpdateEquipamentoDTO): Promise<Equipamento> {
    const equipamento = await this.updateEquipamentoUseCase.execute(id, dto);

    SocketService.getInstance().emitEntityChange(
      "equipamento",
      "update",
      equipamento
    );

    return equipamento;
  }
  async delete(id: number, userId: string): Promise<void> {
    await this.deleteEquipamentoUseCase.execute(id, userId);

    SocketService.getInstance().emitEntityChange("equipamento", "delete");
  }
}
