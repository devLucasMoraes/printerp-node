import { Router } from "express";
import { EstoqueControllerFactory } from "../factories/EstoqueControllerFactory";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  adjustEstoqueSchema,
  estoqueParamsSchema,
  estoqueQuerySchema,
} from "../validators/estoque.schema";

const estoqueController = EstoqueControllerFactory.create();

const estoqueRoutes = Router();

estoqueRoutes.get(
  "/estoques",
  isAuth,
  validate({ query: estoqueQuerySchema }),
  estoqueController.listPaginated
);

estoqueRoutes.put(
  "/estoques/adjust/:id",
  isAuth,
  validate({ body: adjustEstoqueSchema, params: estoqueParamsSchema }),
  estoqueController.adjust
);

export default estoqueRoutes;
