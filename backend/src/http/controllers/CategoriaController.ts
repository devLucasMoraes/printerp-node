import { RequestHandler } from "express";
import { Categoria } from "../../domain/entities/Categoria";
import { CategoriaService } from "../../domain/services/CategoriaService";
import { pageable } from "../../shared/utils/pageable";
import {
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
} from "../validators/categoria.schemas";

export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  list: RequestHandler = async (req, res) => {
    const result = await this.categoriaService.list();

    const mappedResult = result.map(this.toDTO);

    res.status(200).json(mappedResult);
  };

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    // arrumar isso aqui depois para fazer a verificação de tipo com o zod
    const result = await this.categoriaService.listPaginated(
      pageable(page as string, size as string, sort as string | string[])
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  create: RequestHandler = async (req, res) => {
    const dto: CreateCategoriaDTO = req.body;
    const userId = req.user.id;

    const result = await this.categoriaService.create({ ...dto, userId });

    const mappedResult = this.toDTO(result);

    res.status(201).json(mappedResult);
  };

  show: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const result = await this.categoriaService.show(parseInt(id));

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const dto: UpdateCategoriaDTO = req.body;
    const userId = req.user.id;

    const result = await this.categoriaService.update(parseInt(id), {
      ...dto,
      userId,
    });
    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.categoriaService.delete(parseInt(id), userId);

    res.status(204).send();
  };

  private toDTO(entity: Categoria) {
    return {
      id: entity.id,
      nome: entity.nome,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
