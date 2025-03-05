import { Router } from "express";
import { estoqueController } from "../controllers/EstoqueController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  adjustEstoqueSchema,
  estoqueParamsSchema,
  estoqueQuerySchema,
} from "../validators/estoque.schema";

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
