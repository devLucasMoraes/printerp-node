import { RequestHandler } from "express";
import { Estoque } from "../../domain/entities/Estoque";
import { EstoqueService } from "../../domain/services/EstoqueService";
import { EstoqueServiceImpl } from "../../services/estoque/EstoqueService";
import { pageable } from "../../shared/utils/pageable";
import { AdjustEstoqueDTO } from "../validators/estoque.schema";

export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    // arrumar isso aqui depois para fazer a verificação de tipo com o zod
    const result = await this.estoqueService.listPaginated(
      pageable(page as string, size as string, sort as string | string[])
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  adjust: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const dto: AdjustEstoqueDTO = req.body;

    const result = await this.estoqueService.adjust(parseInt(id), {
      ...dto,
      userId,
    });

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  private toDTO(entity: Estoque) {
    return {
      id: entity.id,
      armazem: entity.armazem,
      insumo: entity.insumo,
      consumoMedioDiario: entity.consumoMedioDiario,
      ultimaAtualizacaoConsumo: entity.ultimaAtualizacaoConsumo,
      abaixoMinimo: entity.estaAbaixoMinimo(),
      diasRestantes: entity.calcularDiasRestantes(),
      previsaoFimEstoque: entity.calcularPrevisaoFimEstoque(),
      previsaoEstoqueMinimo: entity.calcularPrevisaoEstoqueMinimo(),
      quantidade: entity.quantidade,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

export const estoqueController = new EstoqueController(
  new EstoqueServiceImpl()
);
