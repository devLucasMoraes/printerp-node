import { RequestHandler } from "express";
import { Armazem } from "../../domain/entities/Armazem";
import { ArmazemService } from "../../domain/services/ArmazemService";
import { ArmazemServiceImpl } from "../../services/armazem/ArmazemServiceImpl";
import { pageable } from "../../shared/utils/pageable";
import {
  CreateArmazemDTO,
  UpdateArmazemDTO,
} from "../validators/armazem.schema";

export class ArmazemController {
  constructor(private readonly armazemService: ArmazemService) {}

  list: RequestHandler = async (req, res) => {
    const result = await this.armazemService.list();

    const mappedResult = result.map(this.toDTO);

    res.status(200).json(mappedResult);
  };

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    // arrumar isso aqui depois para fazer a verificação de tipo com o zod
    const result = await this.armazemService.listPaginated(
      pageable(page as string, size as string, sort as string | string[])
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  create: RequestHandler = async (req, res) => {
    const dto: CreateArmazemDTO = req.body;
    const userId = req.user.id;

    const result = await this.armazemService.create({ ...dto, userId });

    const mappedResult = this.toDTO(result);

    res.status(201).json(mappedResult);
  };

  show: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const result = await this.armazemService.show(parseInt(id));

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const dto: UpdateArmazemDTO = req.body;
    const userId = req.user.id;

    const result = await this.armazemService.update(parseInt(id), {
      ...dto,
      userId,
    });
    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.armazemService.delete(parseInt(id), userId);

    res.status(204).send();
  };

  private toDTO(entity: Armazem) {
    return {
      id: entity.id,
      nome: entity.nome,
      ativo: entity.ativo,
    };
  }
}

export const armazemController = new ArmazemController(
  new ArmazemServiceImpl()
);
