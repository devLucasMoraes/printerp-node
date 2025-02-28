import { Categoria } from "../../domain/entities/Categoria";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { CategoriaService } from "../../domain/services/CategoriaService";
import { CreateCategoriaUseCase } from "../../domain/useCases/categoria/CreateCategoriaUseCase";
import { DeleteCategoriaUseCase } from "../../domain/useCases/categoria/DeleteCategoriaUseCase";
import { GetAllCategoriaUseCase } from "../../domain/useCases/categoria/GetAllCategoriaUseCase";
import { GetCategoriaUseCase } from "../../domain/useCases/categoria/GetCategoriaUseCase";
import { ListCategoriaUseCase } from "../../domain/useCases/categoria/ListCategoriaUseCase";
import { UpdateCategoriaUseCase } from "../../domain/useCases/categoria/UpdateCategoriaUseCase";
import {
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
} from "../../http/validators/categoria.schemas";
import { SocketService } from "../socket/SocketService";

export class CategoriaServiceImpl implements CategoriaService {
  constructor(
    private readonly createCategoriaUseCase: CreateCategoriaUseCase,
    private readonly updateCategoriaUseCase: UpdateCategoriaUseCase,
    private readonly deleteCategoriaUseCase: DeleteCategoriaUseCase,
    private readonly getCategoriaUseCase: GetCategoriaUseCase,
    private readonly getAllCategoriaUseCase: GetAllCategoriaUseCase,
    private readonly listCategoriaUseCase: ListCategoriaUseCase
  ) {}
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Categoria>> {
    return await this.listCategoriaUseCase.execute(pageRequest);
  }
  async list(): Promise<Categoria[]> {
    return await this.getAllCategoriaUseCase.execute();
  }
  async show(id: number): Promise<Categoria> {
    return this.getCategoriaUseCase.execute(id);
  }
  async create(dto: CreateCategoriaDTO): Promise<Categoria> {
    const categoria = await this.createCategoriaUseCase.execute(dto);

    SocketService.getInstance().emitEntityChange(
      "categoria",
      "create",
      categoria
    );

    return categoria;
  }
  async update(id: number, dto: UpdateCategoriaDTO): Promise<Categoria> {
    const categoria = await this.updateCategoriaUseCase.execute(id, dto);

    SocketService.getInstance().emitEntityChange(
      "categoria",
      "update",
      categoria
    );

    return categoria;
  }
  async delete(id: number, userID: string): Promise<void> {
    await this.deleteCategoriaUseCase.execute(id, userID);

    SocketService.getInstance().emitEntityChange("categoria", "delete");
  }
}
