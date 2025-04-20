import { RequestHandler } from "express";
import { MovimentoEstoque } from "../../domain/entities/MovimentoEstoque";
import { MovimentoEstoqueService } from "../../domain/services/MovimentoEstoqueService";
import { MovimentoEstoqueServiceImpl } from "../../services/movimento-estoque/MovimentoEstoqueServiceImpl";
import { pageable } from "../../shared/utils/pageable";
import { MovimentoEstoqueQuerySchema } from "../validators/movimentoEstoque.schema";

export class MovimentoEstoqueController {
  constructor(
    private readonly movimentoEstoqueService: MovimentoEstoqueService
  ) {}

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort }: MovimentoEstoqueQuerySchema = req.query;

    const filters: Record<string, any> = {};

    const pageRequest = pageable(page, size, sort);

    pageRequest.filters = filters;

    const result = await this.movimentoEstoqueService.listPaginated(
      pageRequest
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  private toDTO(entity: MovimentoEstoque) {
    return {
      id: entity.id,
      armazemDestino: entity.armazemDestino,
      armazemOrigem: entity.armazemOrigem,
      insumo: entity.insumo,
      tipo: entity.tipo,
      data: entity.data,
      valorUnitario: entity.valorUnitario,
      unidade: entity.undidade,
      documentoOrigem: entity.documentoOrigem,
      tipoDocumento: entity.tipoDocumento,
      regularizado: entity.regularizado,
      observacao: entity.observacao,
      userId: entity.userId,
      estorno: entity.estorno,
      quantidade: entity.quantidade,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

export const movimentoEstoqueController = new MovimentoEstoqueController(
  new MovimentoEstoqueServiceImpl()
);
