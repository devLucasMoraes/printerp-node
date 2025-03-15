import { RequestHandler } from "express";
import { Setor } from "../../domain/entities/Setor";
import { SetorService } from "../../domain/services/SetorService";
import { SetorServiceImpl } from "../../services/setor/SetorServiceImpl";
import { pageable } from "../../shared/utils/pageable";
import { CreateSetorDTO, UpdateSetorDTO } from "../validators/setor.schemas";

export class SetorController {
  constructor(private readonly setorService: SetorService) {}

  list: RequestHandler = async (req, res) => {
    const result = await this.setorService.list();

    const mappedResult = result.map(this.toDTO);

    res.status(200).json(mappedResult);
  };

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    // arrumar isso aqui depois para fazer a verificação de tipo com o zod
    const result = await this.setorService.listPaginated(
      pageable(page as string, size as string, sort as string | string[])
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  create: RequestHandler = async (req, res) => {
    const dto: CreateSetorDTO = req.body;
    const userId = req.user.id;

    const result = await this.setorService.create({ ...dto, userId });

    const mappedResult = this.toDTO(result);

    res.status(201).json(mappedResult);
  };

  show: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const result = await this.setorService.show(parseInt(id));

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const dto: UpdateSetorDTO = req.body;
    const userId = req.user.id;

    const result = await this.setorService.update(parseInt(id), {
      ...dto,
      userId,
    });
    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.setorService.delete(parseInt(id), userId);

    res.status(204).send();
  };

  private toDTO(entity: Setor) {
    return {
      id: entity.id,
      nome: entity.nome,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

export const setorController = new SetorController(new SetorServiceImpl());
