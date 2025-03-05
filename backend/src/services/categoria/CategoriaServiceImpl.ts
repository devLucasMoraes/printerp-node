import { Categoria } from "../../domain/entities/Categoria";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { CategoriaService } from "../../domain/services/CategoriaService";
import { createCategoriaUseCase } from "../../domain/useCases/categoria/CreateCategoriaUseCase";
import { deleteCategoriaUseCase } from "../../domain/useCases/categoria/DeleteCategoriaUseCase";
import { getAllCategoriaUseCase } from "../../domain/useCases/categoria/GetAllCategoriaUseCase";
import { getCategoriaUseCase } from "../../domain/useCases/categoria/GetCategoriaUseCase";
import { listCategoriaUseCase } from "../../domain/useCases/categoria/ListCategoriaUseCase";
import { updateCategoriaUseCase } from "../../domain/useCases/categoria/UpdateCategoriaUseCase";

import {
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
} from "../../http/validators/categoria.schemas";
import { SocketService } from "../socket/SocketService";

export class CategoriaServiceImpl implements CategoriaService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Categoria>> {
    return await listCategoriaUseCase.execute(pageRequest);
  }
  async list(): Promise<Categoria[]> {
    return await getAllCategoriaUseCase.execute();
  }
  async show(id: number): Promise<Categoria> {
    return getCategoriaUseCase.execute(id);
  }
  async create(dto: CreateCategoriaDTO): Promise<Categoria> {
    const categoria = await createCategoriaUseCase.execute(dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("categoria", "create", categoria);
    }

    return categoria;
  }
  async update(id: number, dto: UpdateCategoriaDTO): Promise<Categoria> {
    const categoria = await updateCategoriaUseCase.execute(id, dto);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("categoria", "update", categoria);
    }

    return categoria;
  }
  async delete(id: number, userID: string): Promise<void> {
    await deleteCategoriaUseCase.execute(id, userID);

    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.emitEntityChange("categoria", "delete");
    }
  }
}
