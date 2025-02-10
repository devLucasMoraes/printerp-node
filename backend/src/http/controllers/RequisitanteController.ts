import { RequestHandler } from "express";
import { Requisitante } from "../../domain/entities/Requisitante";
import { RequisitanteService } from "../../domain/services/RequisitanteService";
import { pageable } from "../../shared/utils/pageable";
import {
  RequisitanteCreateDto,
  RequisitanteUpdateDto,
} from "../validators/requisitante.schemas";

export class RequisitanteController {
  constructor(private readonly requisitanteService: RequisitanteService) {}

  list: RequestHandler = async (req, res) => {
    const result = await this.requisitanteService.list();

    const mappedResult = result.map(this.toDTO);

    res.status(200).json(mappedResult);
  };

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    // arrumar isso aqui depois para fazer a verificação de tipo com o zod
    const result = await this.requisitanteService.listPaginated(
      pageable(page as string, size as string, sort as string | string[])
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  create: RequestHandler = async (req, res) => {
    const { nome, fone }: RequisitanteCreateDto = req.body;

    const requisitante = new Requisitante({
      nome,
      fone,
    });

    const result = await this.requisitanteService.create(requisitante);

    const mappedResult = this.toDTO(result);

    res.status(201).json(mappedResult);
  };

  show: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const result = await this.requisitanteService.show(parseInt(id));

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { nome, fone }: RequisitanteUpdateDto = req.body;

    const requisitante = new Requisitante({
      nome,
      fone,
    });

    const result = await this.requisitanteService.update(
      parseInt(id),
      requisitante
    );
    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;

    await this.requisitanteService.delete(parseInt(id));

    res.status(204).send();
  };

  private toDTO(entity: Requisitante) {
    return {
      id: entity.id,
      nome: entity.nome,
      fone: entity.fone,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
