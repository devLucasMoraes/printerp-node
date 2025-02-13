import { RequisicaoEstoque } from "../../domain/entities/RequisicaoEstoque";
import { requisicaoEstoqueRepository } from "../../domain/repositories";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { RequisicaoEstoqueService } from "../../domain/services/RequisicaoEstoqueService";
import { BadRequestError, NotFoundError } from "../../shared/errors";

export class RequisicaoEstoqueServiceImpl implements RequisicaoEstoqueService {
  async listPaginated(
    pageRequest?: PageRequest
  ): Promise<Page<RequisicaoEstoque>> {
    return await requisicaoEstoqueRepository.findAllPaginated(pageRequest);
  }
  async list(): Promise<RequisicaoEstoque[]> {
    return await requisicaoEstoqueRepository.find({
      relations: {
        requisitante: true,
        equipamento: true,
        itens: {
          insumo: true,
        },
      },
    });
  }
  async show(id: number): Promise<RequisicaoEstoque> {
    const requisicaoEstoqueExists = await requisicaoEstoqueRepository.findOne({
      where: { id },
      relations: {
        requisitante: true,
        equipamento: true,
        itens: {
          insumo: true,
        },
      },
    });

    if (!requisicaoEstoqueExists) {
      throw new NotFoundError("RequisicaoEstoque not found");
    }

    return requisicaoEstoqueExists;
  }
  async create(entity: RequisicaoEstoque): Promise<RequisicaoEstoque> {
    const newRequisicaoEstoque = requisicaoEstoqueRepository.create(entity);

    return await requisicaoEstoqueRepository.save(newRequisicaoEstoque);
  }
  async update(
    id: number,
    entity: RequisicaoEstoque
  ): Promise<RequisicaoEstoque> {
    const requisicaoEstoqueExists = await requisicaoEstoqueRepository.findOne({
      where: { id },
      relations: {
        requisitante: true,
        equipamento: true,
        itens: {
          insumo: true,
        },
      },
    });

    if (!requisicaoEstoqueExists) {
      throw new NotFoundError("RequisicaoEstoque not found");
    }

    const itensComId = entity.itens.filter((item) => item.id !== undefined);
    const todosItensPertencem = itensComId.every((item) =>
      requisicaoEstoqueExists.itens.some(
        (existingItem) => existingItem.id === item.id
      )
    );

    if (!todosItensPertencem) {
      throw new BadRequestError("Cannot update item from another requisicao");
    }

    const {
      requisitante: _r,
      equipamento: _e,
      itens: _i,
      ...requisicaoEstoqueBase
    } = requisicaoEstoqueExists;

    const updatedRequisicaoEstoque = requisicaoEstoqueRepository.merge(
      requisicaoEstoqueBase as RequisicaoEstoque,
      entity
    );

    return await requisicaoEstoqueRepository.save(updatedRequisicaoEstoque);
  }
  async delete(id: number): Promise<void> {
    const requisicaoEstoqueExists = await requisicaoEstoqueRepository.findOne({
      where: { id },
      relations: {
        requisitante: true,
        equipamento: true,
        itens: {
          insumo: true,
        },
      },
    });

    if (!requisicaoEstoqueExists) {
      throw new NotFoundError("RequisicaoEstoque not found");
    }

    await requisicaoEstoqueRepository.softRemove(requisicaoEstoqueExists);

    return Promise.resolve();
  }
}
