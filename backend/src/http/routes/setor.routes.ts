import { Router } from "express";
import { setorController } from "../controllers/SetorController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  equipamentoParamsSchema,
  setorCreateSchema,
  setorQuerySchema,
  setorUpdateSchema,
} from "../validators/setor.schemas";

const setorRoutes = Router();

setorRoutes.get("/setores-all", isAuth, setorController.list);

setorRoutes.get(
  "/setores",
  isAuth,
  validate({ query: setorQuerySchema }),
  setorController.listPaginated
);

setorRoutes.post(
  "/setores",
  isAuth,
  validate({ body: setorCreateSchema }),
  setorController.create
);

setorRoutes.put(
  "/setores/:id",
  isAuth,
  validate({
    body: setorUpdateSchema,
    params: equipamentoParamsSchema,
  }),
  setorController.update
);

setorRoutes.get(
  "/setores/:id",
  isAuth,
  validate({ params: equipamentoParamsSchema }),
  setorController.show
);

setorRoutes.delete(
  "/setores/:id",
  isAuth,
  validate({ params: equipamentoParamsSchema }),
  setorController.delete
);

export default setorRoutes;
