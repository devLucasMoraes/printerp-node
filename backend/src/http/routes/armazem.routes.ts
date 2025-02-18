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

armazemRoutes.get("/armazem-all", isAuth, armazemController.list);

armazemRoutes.get(
  "/armazem",
  isAuth,
  validate({ query: armazemQuerySchema }),
  armazemController.listPaginated
);

armazemRoutes.post(
  "/armazem",
  isAuth,
  validate({ body: armazemCreateSchema }),
  armazemController.create
);

armazemRoutes.put(
  "/armazem/:id",
  isAuth,
  validate({
    body: armazemUpdateSchema,
    params: armazemParamsSchema,
  }),
  armazemController.update
);

armazemRoutes.get(
  "/armazem/:id",
  isAuth,
  validate({ params: armazemParamsSchema }),
  armazemController.show
);

armazemRoutes.delete(
  "/armazem/:id",
  isAuth,
  validate({ params: armazemParamsSchema }),
  armazemController.delete
);

export default armazemRoutes;
