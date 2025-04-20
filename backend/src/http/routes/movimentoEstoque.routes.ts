import { Router } from "express";
import { movimentoEstoqueController } from "../controllers/MovimentoEstoqueController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import { movimentoEstoqueQuerySchema } from "../validators/movimentoEstoque.schema";

const movimentoEstoqueRoutes = Router();

movimentoEstoqueRoutes.get(
  "/movimentacoes-estoque",
  isAuth,
  validate({ query: movimentoEstoqueQuerySchema }),
  movimentoEstoqueController.listPaginated
);

export default movimentoEstoqueRoutes;
