import { Equipamento } from "../../domain/entities/Equipamento";
import { equipamentoRepository } from "../../domain/repositories";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { EquipamentoService } from "../../domain/services/EquipamentoService";
import { BadRequestError, NotFoundError } from "../../shared/errors";

export class EquipamentoServiceImpl implements EquipamentoService {
  async listPaginated(pageRequest?: PageRequest): Promise<Page<Equipamento>> {
    return await equipamentoRepository.findAllPaginated(pageRequest);
  }
  async list(): Promise<Equipamento[]> {
    return await equipamentoRepository.find();
  }
  async show(id: number): Promise<Equipamento> {
    const equipamentoExists = await equipamentoRepository.findOneBy({ id });

    if (!equipamentoExists) {
      throw new NotFoundError("Equipamento not found");
    }

    return equipamentoExists;
  }
  async create(entity: Equipamento): Promise<Equipamento> {
    const { nome } = entity;

    const equipamentoExists = await equipamentoRepository.findOneBy({ nome });

    if (equipamentoExists) {
      throw new BadRequestError("Equipamento already exists");
    }

    const newEquipamento = equipamentoRepository.create(entity);

    return equipamentoRepository.save(newEquipamento);
  }
  async update(id: number, entity: Equipamento): Promise<Equipamento> {
    const requisitanteExists = await equipamentoRepository.findOneBy({ id });

    if (!requisitanteExists) {
      throw new NotFoundError("Equipamento not found");
    }

    const { nome } = entity;

    const nameExists = await equipamentoRepository.findOneBy({ nome });

    if (nameExists && nameExists.id !== id) {
      throw new BadRequestError("Equipamento already exists");
    }

    const updatedRequisitante = equipamentoRepository.merge(
      requisitanteExists,
      entity
    );

    return await equipamentoRepository.save(updatedRequisitante);
  }
  async delete(id: number): Promise<void> {
    const equipamentoExists = equipamentoRepository.findOneBy({ id });

    if (!equipamentoExists) {
      throw new NotFoundError("Equipamento not found");
    }

    await equipamentoRepository.softDelete(id);

    return Promise.resolve();
  }
}
