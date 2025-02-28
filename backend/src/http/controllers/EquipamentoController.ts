import { RequestHandler } from "express";
import { Equipamento } from "../../domain/entities/Equipamento";
import { EquipamentoService } from "../../domain/services/EquipamentoService";
import { pageable } from "../../shared/utils/pageable";
import {
  CreateEquipamentoDTO,
  UpdateEquipamentoDTO,
} from "../validators/equipamento.schemas";

export class EquipamentoController {
  constructor(private readonly equipamentoService: EquipamentoService) {}

  list: RequestHandler = async (req, res) => {
    const result = await this.equipamentoService.list();

    const mappedResult = result.map(this.toDTO);

    res.status(200).json(mappedResult);
  };

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    // arrumar isso aqui depois para fazer a verificação de tipo com o zod
    const result = await this.equipamentoService.listPaginated(
      pageable(page as string, size as string, sort as string | string[])
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  create: RequestHandler = async (req, res) => {
    const dto: CreateEquipamentoDTO = req.body;
    const userId = req.user.id;

    const result = await this.equipamentoService.create({ ...dto, userId });

    const mappedResult = this.toDTO(result);

    res.status(201).json(mappedResult);
  };

  show: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const result = await this.equipamentoService.show(parseInt(id));

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const dto: UpdateEquipamentoDTO = req.body;
    const userId = req.user.id;

    const result = await this.equipamentoService.update(parseInt(id), {
      ...dto,
      userId,
    });
    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.equipamentoService.delete(parseInt(id), userId);

    res.status(204).send();
  };

  private toDTO(entity: Equipamento) {
    return {
      id: entity.id,
      nome: entity.nome,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
