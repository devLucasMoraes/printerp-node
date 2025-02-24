import { Insumo } from "../../domain/entities/Insumo";
import { insumoRepository } from "../../domain/repositories";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { InsumoService } from "../../domain/services/InsumoService";
import { BadRequestError, NotFoundError } from "../../shared/errors";
import { SocketService } from "../socket/SocketService";

export class InsumoServiceImpl implements InsumoService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Insumo>> {
    return await insumoRepository.findAllPaginated(pageRequest);
  }
  async list(): Promise<Insumo[]> {
    return await insumoRepository.find();
  }
  async show(id: number): Promise<Insumo> {
    const insumoExists = await insumoRepository.findOne({
      where: { id },
      relations: {
        categoria: true,
      },
    });

    if (!insumoExists) {
      throw new NotFoundError("Insumo not found");
    }

    return insumoExists;
  }
  async create(entity: Insumo): Promise<Insumo> {
    const { descricao } = entity;

    const insumoExists = await insumoRepository.findOneBy({ descricao });

    if (insumoExists) {
      throw new BadRequestError("Insumo already exists");
    }

    const newInsumo = insumoRepository.create(entity);

    const insumo = await insumoRepository.save(newInsumo);

    SocketService.getInstance().emitEntityChange("insumo", "create", insumo);

    return insumo;
  }
  async update(id: number, entity: Insumo): Promise<Insumo> {
    const insumoExists = await insumoRepository.findOneBy({ id });

    if (!insumoExists) {
      throw new NotFoundError("Insumo not found");
    }

    const { descricao } = entity;

    const nameExists = await insumoRepository.findOneBy({ descricao });

    if (nameExists && nameExists.id !== id) {
      throw new BadRequestError("Insumo already exists");
    }

    const updatedInsumo = insumoRepository.merge(insumoExists, entity);

    const insumo = await insumoRepository.save(updatedInsumo);

    SocketService.getInstance().emitEntityChange("insumo", "update", insumo);

    return insumo;
  }
  async delete(id: number): Promise<void> {
    const insumoExists = await insumoRepository.findOneBy({ id });

    if (!insumoExists) {
      throw new NotFoundError("Insumo not found");
    }

    await insumoRepository.softDelete(id);

    SocketService.getInstance().emitEntityChange("insumo", "delete");

    return Promise.resolve();
  }
}
