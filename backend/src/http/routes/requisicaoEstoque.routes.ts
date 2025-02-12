import { Router } from "express";
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

const requisicaoEstoqueService = new RequisicaoEstoqueServiceImpl();
const requisicaoEstoqueController = new RequisicaoEstoqueController(
  requisicaoEstoqueService
);

const requisicaoEstoqueRoutes = Router();

requisicaoEstoqueRoutes.get(
  "/requisicaoEstoques-all",
  isAuth,
  requisicaoEstoqueController.list
);

requisicaoEstoqueRoutes.get(
  "/requisicaoEstoques",
  isAuth,
  validate({ query: requisicaoEstoqueQuerySchema }),
  requisicaoEstoqueController.listPaginated
);

requisicaoEstoqueRoutes.post(
  "/requisicaoEstoques",
  isAuth,
  validate({ body: requisicaoEstoqueCreateSchema }),
  requisicaoEstoqueController.create
);

requisicaoEstoqueRoutes.put(
  "/requisicaoEstoques/:id",
  isAuth,
  validate({
    body: requisicaoEstoqueUpdateSchema,
    params: requisicaoEstoqueParamsSchema,
  }),
  requisicaoEstoqueController.update
);

requisicaoEstoqueRoutes.get(
  "/requisicaoEstoques/:id",
  isAuth,
  validate({ params: requisicaoEstoqueParamsSchema }),
  requisicaoEstoqueController.show
);

requisicaoEstoqueRoutes.delete(
  "/requisicaoEstoques/:id",
  isAuth,
  validate({ params: requisicaoEstoqueParamsSchema }),
  requisicaoEstoqueController.delete
);

export default requisicaoEstoqueRoutes;
