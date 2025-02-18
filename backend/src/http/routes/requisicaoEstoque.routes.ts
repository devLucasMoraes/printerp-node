import { Router } from "express";
import { RequisicaoEstoqueControllerFactory } from "../factories/RequisicaoEstoqueControllerFactory";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  requisicaoEstoqueCreateSchema,
  requisicaoEstoqueParamsSchema,
  requisicaoEstoqueQuerySchema,
  requisicaoEstoqueUpdateSchema,
} from "../validators/requisicaoEstoque.schemas";

const requisicaoEstoqueController = RequisicaoEstoqueControllerFactory.create();

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
