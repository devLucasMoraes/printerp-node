import { Categoria } from "../../domain/entities/Categoria";
import { categoriaRepository } from "../../domain/repositories";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { CategoriaService } from "../../domain/services/CategoriaService";
import { BadRequestError, NotFoundError } from "../../shared/errors";
import { SocketService } from "../socket/SocketService";

export class CategoriaServiceImpl implements CategoriaService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Categoria>> {
    return await categoriaRepository.findAllPaginated(pageRequest);
  }
  async list(): Promise<Categoria[]> {
    return await categoriaRepository.find();
  }
  async show(id: number): Promise<Categoria> {
    const categoriaExists = await categoriaRepository.findOneBy({ id });

    if (!categoriaExists) {
      throw new NotFoundError("Categoria not found");
    }

    return categoriaExists;
  }
  async create(entity: Categoria): Promise<Categoria> {
    const { nome } = entity;

    const categoriaExists = await categoriaRepository.findOneBy({ nome });

    if (categoriaExists) {
      throw new BadRequestError("Categoria already exists");
    }

    const newCategoria = categoriaRepository.create(entity);

    const categoria = await categoriaRepository.save(newCategoria);

    SocketService.getInstance().emitEntityChange(
      "categoria",
      "create",
      categoria
    );

    return categoria;
  }
  async update(id: number, entity: Categoria): Promise<Categoria> {
    const categoriaExists = await categoriaRepository.findOneBy({ id });

    if (!categoriaExists) {
      throw new NotFoundError("Categoria not found");
    }

    const { nome } = entity;

    const nameExists = await categoriaRepository.findOneBy({ nome });

    if (nameExists && nameExists.id !== id) {
      throw new BadRequestError("Categoria already exists");
    }

    const updatedCategoria = categoriaRepository.merge(categoriaExists, entity);

    const categoria = await categoriaRepository.save(updatedCategoria);

    SocketService.getInstance().emitEntityChange(
      "categoria",
      "update",
      categoria
    );

    return categoria;
  }
  async delete(id: number): Promise<void> {
    const categoriaExists = await categoriaRepository.findOneBy({ id });

    if (!categoriaExists) {
      throw new NotFoundError("Categoria not found");
    }

    await categoriaRepository.softDelete(id);

    SocketService.getInstance().emitEntityChange("categoria", "delete");

    return Promise.resolve();
  }
}
