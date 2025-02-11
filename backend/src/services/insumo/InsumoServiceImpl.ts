import { Insumo } from "../../domain/entities/Insumo";
import { insumoRepository } from "../../domain/repositories";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { InsumoService } from "../../domain/services/InsumoService";
import { BadRequestError, NotFoundError } from "../../shared/errors";

export class InsumoServiceImpl implements InsumoService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Insumo>> {
    return await insumoRepository.findAllPaginated(pageRequest);
  }
  async list(): Promise<Insumo[]> {
    return await insumoRepository.find();
  }
  async show(id: number): Promise<Insumo> {
    const insumoExists = await insumoRepository.findOneBy({ id });

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

    return await insumoRepository.save(newInsumo);
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

    return await insumoRepository.save(updatedInsumo);
  }
  async delete(id: number): Promise<void> {
    const insumoExists = await insumoRepository.findOneBy({ id });

    if (!insumoExists) {
      throw new NotFoundError("Insumo not found");
    }

    await insumoRepository.delete(id);

    return Promise.resolve();
  }
}
