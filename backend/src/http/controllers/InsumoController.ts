import { RequestHandler } from "express";
import { Categoria } from "../../domain/entities/Categoria";
import { Insumo } from "../../domain/entities/Insumo";
import { InsumoService } from "../../domain/services/InsumoService";
import { pageable } from "../../shared/utils/pageable";
import { CreateInsumoDTO } from "../validators/insumo.schemas";

export class InsumoController {
  constructor(private readonly insumoService: InsumoService) {}

  list: RequestHandler = async (req, res) => {
    const result = await this.insumoService.list();

    const mappedResult = result.map(this.toDTO);

    res.status(200).json(mappedResult);
  };

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    // arrumar isso aqui depois para fazer a verificação de tipo com o zod
    const result = await this.insumoService.listPaginated(
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
      descricao,
      valorUntMed,
      valorUntMedAuto,
      undEstoque,
      estoqueMinimo,
      categoria,
    }: CreateInsumoDTO = req.body;
    const userId = req.user.id;

    const insumo = new Insumo({
      descricao,
      valorUntMed,
      valorUntMedAuto,
      undEstoque,
      estoqueMinimo,
      categoria: new Categoria({ id: categoria.id }),
      userId,
    });

    const result = await this.insumoService.create(insumo);

    const mappedResult = this.toDTO(result);

    res.status(201).json(mappedResult);
  };

  show: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const result = await this.insumoService.show(parseInt(id));

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const {
      descricao,
      valorUntMed,
      valorUntMedAuto,
      undEstoque,
      estoqueMinimo,
      categoria,
    }: CreateInsumoDTO = req.body;

    const insumo = new Insumo({
      descricao,
      valorUntMed,
      valorUntMedAuto,
      undEstoque,
      estoqueMinimo,
      categoria: new Categoria({ id: categoria.id }),
      userId,
    });

    const result = await this.insumoService.update(parseInt(id), insumo);
    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.insumoService.delete(parseInt(id), userId);

    res.status(204).send();
  };

  private toDTO(entity: Insumo) {
    return {
      id: entity.id,
      descricao: entity.descricao,
      valorUntMed: entity.valorUntMed,
      valorUntMedAuto: entity.valorUntMedAuto,
      undEstoque: entity.undEstoque,
      estoqueMinimo: entity.estoqueMinimo,
      categoria: entity.categoria,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
