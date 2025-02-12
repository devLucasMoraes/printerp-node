import { RequisicaoEstoque } from "../../domain/entities/RequisicaoEstoque";
import { requisicaoEstoqueRepository } from "../../domain/repositories";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { RequisicaoEstoqueService } from "../../domain/services/RequisicaoEstoqueService";
import { NotFoundError } from "../../shared/errors";

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
    const requisicaoEstoqueExists = await requisicaoEstoqueRepository.findOneBy(
      { id }
    );

    if (!requisicaoEstoqueExists) {
      throw new NotFoundError("RequisicaoEstoque not found");
    }

    const updatedRequisicaoEstoque = requisicaoEstoqueRepository.merge(
      requisicaoEstoqueExists,
      entity
    );

    return await requisicaoEstoqueRepository.save(updatedRequisicaoEstoque);
  }
  async delete(id: number): Promise<void> {
    const requisicaoEstoqueExists = await requisicaoEstoqueRepository.findOneBy(
      { id }
    );

    if (!requisicaoEstoqueExists) {
      throw new NotFoundError("RequisicaoEstoque not found");
    }

    await requisicaoEstoqueRepository.softDelete(id);

    return Promise.resolve();
  }
}
