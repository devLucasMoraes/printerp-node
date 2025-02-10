import { RequestHandler } from "express";
import { Equipamento } from "../../domain/entities/Equipamento";
import { EquipamentoService } from "../../domain/services/EquipamentoService";
import { pageable } from "../../shared/utils/pageable";
import {
  EquipamentoCreateDto,
  EquipamentoUpdateDto,
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
    const { nome }: EquipamentoCreateDto = req.body;

    const equipamento = new Equipamento({
      nome,
    });

    const result = await this.equipamentoService.create(equipamento);

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
    const { nome }: EquipamentoUpdateDto = req.body;

    const equipamento = new Equipamento({
      nome,
    });

    const result = await this.equipamentoService.update(
      parseInt(id),
      equipamento
    );
    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;

    await this.equipamentoService.delete(parseInt(id));

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
