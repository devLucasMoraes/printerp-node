import { Router } from "express";
import { InsumoServiceImpl } from "../../services/insumo/InsumoServiceImpl";
import { InsumoController } from "../controllers/InsumoController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  insumoCreateSchema,
  insumoParamsSchema,
  insumoQuerySchema,
  insumoUpdateSchema,
} from "../validators/insumo.schemas";

const insumoService = new InsumoServiceImpl();
const insumoController = new InsumoController(insumoService);

const insumoRoutes = Router();

insumoRoutes.get("/insumos-all", isAuth, insumoController.list);

insumoRoutes.get(
  "/insumos",
  isAuth,
  validate({ query: insumoQuerySchema }),
  insumoController.listPaginated
);

insumoRoutes.post(
  "/insumos",
  isAuth,
  validate({ body: insumoCreateSchema }),
  insumoController.create
);

insumoRoutes.put(
  "/insumos/:id",
  isAuth,
  validate({ body: insumoUpdateSchema, params: insumoParamsSchema }),
  insumoController.update
);

insumoRoutes.get(
  "/insumos/:id",
  isAuth,
  validate({ params: insumoParamsSchema }),
  insumoController.show
);

insumoRoutes.delete(
  "/insumos/:id",
  isAuth,
  validate({ params: insumoParamsSchema }),
  insumoController.delete
);

export default insumoRoutes;
