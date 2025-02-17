import { Router } from "express";
import { EstoqueRepository } from "../../domain/repositories/EstoqueRepository";
import { MovimentoEstoqueRepository } from "../../domain/repositories/MovimentoEstoqueRepository";
import { RequisicaoEstoqueRepository } from "../../domain/repositories/RequisicaoEstoqueRepository";
import { CreateRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/CreateRequisicaoEstoqueUseCase";
import { DeleteRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/DeleteRequisicaoEstoqueUseCase";
import { GetAllRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/GetAllRequisicaoEstoqueUseCase";
import { GetRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/GetRequisicaoEstoqueUseCase";
import { ListRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/ListRequisicaoEstoqueUseCase";
import { UpdateRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/UpdateRequisicaoEstoqueUseCase";
import { RequisicaoEstoqueServiceImpl } from "../../services/requisicao-estoque/RequisicaoEstoqueServiceImpl";
import { RequisicaoEstoqueController } from "../controllers/RequisicaoEstoqueController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  requisicaoEstoqueCreateSchema,
  requisicaoEstoqueParamsSchema,
  requisicaoEstoqueQuerySchema,
  requisicaoEstoqueUpdateSchema,
} from "../validators/requisicaoEstoque.schemas";

const requisicaoEstoqueRepository = new RequisicaoEstoqueRepository();
const estoqueRepository = new EstoqueRepository();
const movimentoEstoqueRepository = new MovimentoEstoqueRepository();

const createRequisicaoEstoqueUseCase = new CreateRequisicaoEstoqueUseCase(
  requisicaoEstoqueRepository,
  movimentoEstoqueRepository
);

const updateRequisicaoEstoqueUseCase = new UpdateRequisicaoEstoqueUseCase(
  requisicaoEstoqueRepository,
  estoqueRepository,
  movimentoEstoqueRepository
);
const deleteRequisicaoEstoqueUseCase = new DeleteRequisicaoEstoqueUseCase(
  requisicaoEstoqueRepository,
  movimentoEstoqueRepository
);
const getRequisicaoEstoqueUseCase = new GetRequisicaoEstoqueUseCase(
  requisicaoEstoqueRepository
);
const getAllRequisicaoEstoqueUseCase = new GetAllRequisicaoEstoqueUseCase(
  requisicaoEstoqueRepository
);
const listRequisicaoEstoqueUseCase = new ListRequisicaoEstoqueUseCase(
  requisicaoEstoqueRepository
);

const requisicaoEstoqueService = new RequisicaoEstoqueServiceImpl(
  createRequisicaoEstoqueUseCase,
  updateRequisicaoEstoqueUseCase,
  deleteRequisicaoEstoqueUseCase,
  getRequisicaoEstoqueUseCase,
  getAllRequisicaoEstoqueUseCase,
  listRequisicaoEstoqueUseCase
);
const requisicaoEstoqueController = new RequisicaoEstoqueController(
  requisicaoEstoqueService
);

const requisicaoEstoqueRoutes = Router();

requisicaoEstoqueRoutes.get(
  "/requisicoes-estoque-all",
  isAuth,
  requisicaoEstoqueController.list
);

requisicaoEstoqueRoutes.get(
  "/requisicoes-estoque",
  isAuth,
  validate({ query: requisicaoEstoqueQuerySchema }),
  requisicaoEstoqueController.listPaginated
);

requisicaoEstoqueRoutes.post(
  "/requisicoes-estoque",
  isAuth,
  validate({ body: requisicaoEstoqueCreateSchema }),
  requisicaoEstoqueController.create
);

requisicaoEstoqueRoutes.put(
  "/requisicoes-estoque/:id",
  isAuth,
  validate({
    body: requisicaoEstoqueUpdateSchema,
    params: requisicaoEstoqueParamsSchema,
  }),
  requisicaoEstoqueController.update
);

requisicaoEstoqueRoutes.get(
  "/requisicoes-estoque/:id",
  isAuth,
  validate({ params: requisicaoEstoqueParamsSchema }),
  requisicaoEstoqueController.show
);

requisicaoEstoqueRoutes.delete(
  "/requisicoes-estoque/:id",
  isAuth,
  validate({ params: requisicaoEstoqueParamsSchema }),
  requisicaoEstoqueController.delete
);

export default requisicaoEstoqueRoutes;
