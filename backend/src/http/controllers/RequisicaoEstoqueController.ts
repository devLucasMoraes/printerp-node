import { RequestHandler } from "express";
import { RequisicaoEstoque } from "../../domain/entities/RequisicaoEstoque";
import { RequisicaoEstoqueService } from "../../domain/services/RequisicaoEstoqueService";
import { pageable } from "../../shared/utils/pageable";
import {
  CreateRequisicaoEstoqueDTO,
  UpdateRequisicaoEstoqueDTO,
} from "../validators/requisicaoEstoque.schemas";

export class RequisicaoEstoqueController {
  constructor(
    private readonly requisicaoEstoqueService: RequisicaoEstoqueService
  ) {}

  list: RequestHandler = async (req, res) => {
    const result = await this.requisicaoEstoqueService.list();

    const mappedResult = result.map(this.toDTO);

    res.status(200).json(mappedResult);
  };

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    // arrumar isso aqui depois para fazer a verificação de tipo com o zod
    const result = await this.requisicaoEstoqueService.listPaginated(
      pageable(page as string, size as string, sort as string | string[])
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  create: RequestHandler = async (req, res) => {
    const dto: CreateRequisicaoEstoqueDTO = req.body;

    const result = await this.requisicaoEstoqueService.create(dto);

    const mappedResult = this.toDTO(result);

    res.status(201).json(mappedResult);
  };

  show: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const result = await this.requisicaoEstoqueService.show(parseInt(id));

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const dto: UpdateRequisicaoEstoqueDTO = req.body;

    const result = await this.requisicaoEstoqueService.update(
      parseInt(id),
      dto
    );
    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;

    await this.requisicaoEstoqueService.delete(parseInt(id));

    res.status(204).send();
  };

  private toDTO(entity: RequisicaoEstoque) {
    return {
      id: entity.id,
      dataRequisicao: entity.dataRequisicao,
      ordemProducao: entity.ordemProducao,
      obs: entity.obs,
      valorTotal: entity.valorTotal,
      requisitante: entity.requisitante,
      equipamento: entity.equipamento,
      armazem: entity.armazem,
      itens: entity.itens.map((item) => {
        return {
          id: item.id,
          quantidade: item.quantidade,
          undEstoque: item.undEstoque,
          valorUnitario: item.valorUnitario,
          insumo: {
            id: item.insumo.id,
            descricao: item.insumo.descricao,
          },
        };
      }),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
