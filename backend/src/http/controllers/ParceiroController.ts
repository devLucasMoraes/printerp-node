import { RequestHandler } from "express";
import { Parceiro } from "../../domain/entities/Parceiro";
import { ParceiroService } from "../../domain/services/ParceiroService";
import { ParceiroServiceImpl } from "../../services/parceiro/ParceiroServiceImpl";
import { pageable } from "../../shared/utils/pageable";
import {
  CreateParceiroDTO,
  UpdateParceiroDTO,
} from "../validators/parceiro.schemas";

export class ParceiroController {
  constructor(private readonly parceiroService: ParceiroService) {}

  list: RequestHandler = async (req, res) => {
    const result = await this.parceiroService.list();

    const mappedResult = result.map(this.toDTO);

    res.status(200).json(mappedResult);
  };

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    // arrumar isso aqui depois para fazer a verificação de tipo com o zod
    const result = await this.parceiroService.listPaginated(
      pageable(page as string, size as string, sort as string | string[])
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  create: RequestHandler = async (req, res) => {
    const dto: CreateParceiroDTO = req.body;
    const userId = req.user.id;

    const result = await this.parceiroService.create({ ...dto, userId });

    const mappedResult = this.toDTO(result);

    res.status(201).json(mappedResult);
  };

  show: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const result = await this.parceiroService.show(parseInt(id));

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const dto: UpdateParceiroDTO = req.body;
    const userId = req.user.id;

    const result = await this.parceiroService.update(parseInt(id), {
      ...dto,
      userId,
    });
    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.parceiroService.delete(parseInt(id), userId);

    res.status(204).send();
  };

  private toDTO(entity: Parceiro) {
    return {
      id: entity.id,
      nome: entity.nome,
      fone: entity.fone,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

export const parceiroController = new ParceiroController(
  new ParceiroServiceImpl()
);
