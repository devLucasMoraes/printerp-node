import { Equipamento } from "../../domain/entities/Equipamento";
import { equipamentoRepository } from "../../domain/repositories";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { EquipamentoService } from "../../domain/services/EquipamentoService";
import { BadRequestError, NotFoundError } from "../../shared/errors";
import { SocketService } from "../socket/SocketService";

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

    const equipamento = await equipamentoRepository.save(newEquipamento);

    SocketService.getInstance().emitEntityChange(
      "equipamento",
      "create",
      equipamento
    );

    return equipamento;
  }
  async update(id: number, entity: Equipamento): Promise<Equipamento> {
    const equipamentoExists = await equipamentoRepository.findOneBy({ id });

    if (!equipamentoExists) {
      throw new NotFoundError("Equipamento not found");
    }

    const { nome } = entity;

    const nameExists = await equipamentoRepository.findOneBy({ nome });

    if (nameExists && nameExists.id !== id) {
      throw new BadRequestError("Equipamento already exists");
    }

    const updatedEquipamento = equipamentoRepository.merge(
      equipamentoExists,
      entity
    );

    const equipamento = await equipamentoRepository.save(updatedEquipamento);

    SocketService.getInstance().emitEntityChange(
      "equipamento",
      "update",
      equipamento
    );

    return equipamento;
  }
  async delete(id: number, userId: string): Promise<void> {
    const equipamentoExists = await equipamentoRepository.findOneBy({ id });

    if (!equipamentoExists) {
      throw new NotFoundError("Equipamento not found");
    }

    equipamentoExists.userId = userId;

    await equipamentoRepository.save(equipamentoExists);

    await equipamentoRepository.softDelete(id);

    SocketService.getInstance().emitEntityChange("equipamento", "delete");

    return Promise.resolve();
  }
}
