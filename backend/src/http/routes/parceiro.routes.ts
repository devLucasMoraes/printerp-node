import { Router } from "express";
import { parceiroController } from "../controllers/ParceiroController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  parceiroCreateSchema,
  parceiroParamsSchema,
  parceiroQuerySchema,
  parceiroUpdateSchema,
} from "../validators/parceiro.schemas";

const parceiroRoutes = Router();

parceiroRoutes.get("/parceiros-all", isAuth, parceiroController.list);

parceiroRoutes.get(
  "/parceiros",
  isAuth,
  validate({ query: parceiroQuerySchema }),
  parceiroController.listPaginated
);

parceiroRoutes.post(
  "/parceiros",
  isAuth,
  validate({ body: parceiroCreateSchema }),
  parceiroController.create
);

parceiroRoutes.put(
  "/parceiros/:id",
  isAuth,
  validate({
    body: parceiroUpdateSchema,
    params: parceiroParamsSchema,
  }),
  parceiroController.update
);

parceiroRoutes.get(
  "/parceiros/:id",
  isAuth,
  validate({ params: parceiroParamsSchema }),
  parceiroController.show
);

parceiroRoutes.delete(
  "/parceiros/:id",
  isAuth,
  validate({ params: parceiroParamsSchema }),
  parceiroController.delete
);

export default parceiroRoutes;
