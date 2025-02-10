import { Requisitante } from "../../domain/entities/Requisitante";
import { requisitanteRepository } from "../../domain/repositories";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { RequisitanteService } from "../../domain/services/RequisitanteService";
import { BadRequestError, NotFoundError } from "../../shared/errors";

export class RequisitanteServiceImpl implements RequisitanteService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Requisitante>> {
    return await requisitanteRepository.findAllPaginated(pageRequest);
  }
  async list(): Promise<Requisitante[]> {
    return await requisitanteRepository.find();
  }
  async show(id: number): Promise<Requisitante> {
    const requisitanteExists = await requisitanteRepository.findOneBy({ id });

    if (!requisitanteExists) {
      throw new NotFoundError("Requisitante not found");
    }

    return requisitanteExists;
  }
  async create(entity: Requisitante): Promise<Requisitante> {
    const { nome } = entity;

    const requisitanteExists = await requisitanteRepository.findOneBy({ nome });

    if (requisitanteExists) {
      throw new BadRequestError("Requisitante already exists");
    }

    const newRequisitante = requisitanteRepository.create(entity);

    return await requisitanteRepository.save(newRequisitante);
  }
  async update(id: number, entity: Requisitante): Promise<Requisitante> {
    const requisitanteExists = await requisitanteRepository.findOneBy({ id });

    if (!requisitanteExists) {
      throw new NotFoundError("Requisitante not found");
    }

    const { nome } = entity;

    const nameExists = await requisitanteRepository.findOneBy({ nome });

    if (nameExists && nameExists.id !== id) {
      throw new BadRequestError("Requisitante already exists");
    }

    const updatedRequisitante = requisitanteRepository.merge(
      requisitanteExists,
      entity
    );
    return await requisitanteRepository.save(updatedRequisitante);
  }
  async delete(id: number): Promise<void> {
    const requisitanteExists = await requisitanteRepository.findOneBy({ id });

    if (!requisitanteExists) {
      throw new NotFoundError("Requisitante not found");
    }

    await requisitanteRepository.softDelete(id);

    return Promise.resolve();
  }
}
