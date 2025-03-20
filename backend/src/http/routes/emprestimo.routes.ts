import { Router } from "express";
import { emprestimoController } from "../controllers/EmprestimoController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  emprestimoCreateSchema,
  emprestimoParamsSchema,
  emprestimoQuerySchema,
  emprestimoUpdateSchema,
} from "../validators/emprestimo.schema";

const emprestimoRoutes = Router();

emprestimoRoutes.get("/emprestimos-all", isAuth, emprestimoController.list);

emprestimoRoutes.get(
  "/emprestimos",
  isAuth,
  validate({ query: emprestimoQuerySchema }),
  emprestimoController.listPaginated
);

emprestimoRoutes.post(
  "/emprestimos",
  isAuth,
  validate({ body: emprestimoCreateSchema }),
  emprestimoController.create
);

emprestimoRoutes.put(
  "/emprestimos/:id",
  isAuth,
  validate({ body: emprestimoUpdateSchema, params: emprestimoParamsSchema }),
  emprestimoController.update
);

emprestimoRoutes.get(
  "/emprestimos/:id",
  isAuth,
  validate({ params: emprestimoParamsSchema }),
  emprestimoController.show
);

emprestimoRoutes.delete(
  "/emprestimos/:id",
  isAuth,
  validate({ params: emprestimoParamsSchema }),
  emprestimoController.delete
);

export default emprestimoRoutes;
