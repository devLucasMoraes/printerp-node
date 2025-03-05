import { Router } from "express";
import { requisitanteController } from "../controllers/RequisitanteController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  requisitanteCreateSchema,
  requisitanteParamsSchema,
  requisitanteQuerySchema,
  requisitanteUpdateSchema,
} from "../validators/requisitante.schemas";

const requisitanteRoutes = Router();

requisitanteRoutes.get(
  "/requisitantes-all",
  isAuth,
  requisitanteController.list
);

requisitanteRoutes.get(
  "/requisitantes",
  isAuth,
  validate({ query: requisitanteQuerySchema }),
  requisitanteController.listPaginated
);

requisitanteRoutes.post(
  "/requisitantes",
  isAuth,
  validate({ body: requisitanteCreateSchema }),
  requisitanteController.create
);

requisitanteRoutes.put(
  "/requisitantes/:id",
  isAuth,
  validate({
    body: requisitanteUpdateSchema,
    params: requisitanteParamsSchema,
  }),
  requisitanteController.update
);

requisitanteRoutes.get(
  "/requisitantes/:id",
  isAuth,
  validate({ params: requisitanteParamsSchema }),
  requisitanteController.show
);

requisitanteRoutes.delete(
  "/requisitantes/:id",
  isAuth,
  validate({ params: requisitanteParamsSchema }),
  requisitanteController.delete
);

export default requisitanteRoutes;
