import { Router } from "express";
import { EstoqueControllerFactory } from "../factories/EstoqueControllerFactory";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import { requisicaoEstoqueQuerySchema } from "../validators/requisicaoEstoque.schemas";

const estoqueController = EstoqueControllerFactory.create();

const estoqueRoutes = Router();

estoqueRoutes.get(
  "/estoques",
  isAuth,
  validate({ query: requisicaoEstoqueQuerySchema }),
  estoqueController.listPaginated
);

export default estoqueRoutes;
