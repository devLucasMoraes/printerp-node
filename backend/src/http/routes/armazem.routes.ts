import { Router } from "express";
import { ArmazemControllerFactory } from "../factories/ArmazemControllerFactory";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  armazemCreateSchema,
  armazemParamsSchema,
  armazemQuerySchema,
  armazemUpdateSchema,
} from "../validators/armazem.schema";

const armazemController = ArmazemControllerFactory.create();

const armazemRoutes = Router();

armazemRoutes.get("/armazens-all", isAuth, armazemController.list);

armazemRoutes.get(
  "/armazens",
  isAuth,
  validate({ query: armazemQuerySchema }),
  armazemController.listPaginated
);

armazemRoutes.post(
  "/armazens",
  isAuth,
  validate({ body: armazemCreateSchema }),
  armazemController.create
);

armazemRoutes.put(
  "/armazens/:id",
  isAuth,
  validate({
    body: armazemUpdateSchema,
    params: armazemParamsSchema,
  }),
  armazemController.update
);

armazemRoutes.get(
  "/armazens/:id",
  isAuth,
  validate({ params: armazemParamsSchema }),
  armazemController.show
);

armazemRoutes.delete(
  "/armazens/:id",
  isAuth,
  validate({ params: armazemParamsSchema }),
  armazemController.delete
);

export default armazemRoutes;
