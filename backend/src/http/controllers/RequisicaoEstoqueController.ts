import { RequestHandler } from "express";
import { Equipamento } from "../../domain/entities/Equipamento";
import { Insumo } from "../../domain/entities/Insumo";
import { RequisicaoEstoque } from "../../domain/entities/RequisicaoEstoque";
import { RequisicaoEstoqueItem } from "../../domain/entities/RequisicaoEstoqueItem";
import { Requisitante } from "../../domain/entities/Requisitante";
import { RequisicaoEstoqueService } from "../../domain/services/RequisicaoEstoqueService";
import { pageable } from "../../shared/utils/pageable";
import { RequisicaoEstoqueCreateDto } from "../validators/requisicaoEstoque.schemas";

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
    const {
      dataRequisicao,
      ordemProducao,
      obs,
      valorTotal,
      equipamento,
      requisitante,
      itens,
    }: RequisicaoEstoqueCreateDto = req.body;

    const requisicaoEstoque = new RequisicaoEstoque({
      dataRequisicao,
      ordemProducao,
      obs,
      valorTotal,
      equipamento: new Equipamento({
        id: equipamento.id,
      }),
      requisitante: new Requisitante({
        id: requisitante.id,
      }),
      itens: itens.map((item) => {
        return new RequisicaoEstoqueItem({
          id: item.id ?? undefined,
          quantidade: item.quantidade,
          undEstoque: item.undEstoque,
          valorUnitario: item.valorUnitario,
          insumo: new Insumo({
            id: item.insumo.id,
          }),
        });
      }),
    });

    const result = await this.requisicaoEstoqueService.create(
      requisicaoEstoque
    );

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
    const {
      dataRequisicao,
      ordemProducao,
      obs,
      valorTotal,
      equipamento,
      requisitante,
      itens,
    }: RequisicaoEstoqueCreateDto = req.body;

    const requisicaoEstoque = new RequisicaoEstoque({
      dataRequisicao,
      ordemProducao,
      obs,
      valorTotal,
      equipamento: new Equipamento({
        id: equipamento.id,
      }),
      requisitante: new Requisitante({
        id: requisitante.id,
      }),
      itens: itens.map((item) => {
        return new RequisicaoEstoqueItem({
          id: item.id ?? undefined,
          quantidade: item.quantidade,
          undEstoque: item.undEstoque,
          valorUnitario: item.valorUnitario,
          insumo: new Insumo({
            id: item.insumo.id,
          }),
        });
      }),
    });

    const result = await this.requisicaoEstoqueService.update(
      parseInt(id),
      requisicaoEstoque
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
      requisitante: {
        id: entity.requisitante.id,
        nome: entity.requisitante.nome,
        fone: entity.requisitante.fone,
      },
      equipamento: {
        id: entity.equipamento.id,
        nome: entity.equipamento.nome,
      },
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
