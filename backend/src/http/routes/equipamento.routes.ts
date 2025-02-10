import { Router } from "express";
import { EquipamentoServiceImpl } from "../../services/equipamento/EquipamentoServiceImpl";
import { EquipamentoController } from "../controllers/EquipamentoController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  equipamentoCreateSchema,
  equipamentoParamsSchema,
  equipamentoQuerySchema,
  equipamentoUpdateSchema,
} from "../validators/equipamento.schemas";

const equipamentoService = new EquipamentoServiceImpl();
const equipamentoController = new EquipamentoController(equipamentoService);

const equipamentoRoutes = Router();

equipamentoRoutes.get("/equipamentos-all", isAuth, equipamentoController.list);

equipamentoRoutes.get(
  "/equipamentos",
  isAuth,
  validate({ query: equipamentoQuerySchema }),
  equipamentoController.listPaginated
);

equipamentoRoutes.post(
  "/equipamentos",
  isAuth,
  validate({ body: equipamentoCreateSchema }),
  equipamentoController.create
);

equipamentoRoutes.put(
  "/equipamentos/:id",
  isAuth,
  validate({
    body: equipamentoUpdateSchema,
    params: equipamentoParamsSchema,
  }),
  equipamentoController.update
);

equipamentoRoutes.get(
  "/equipamentos/:id",
  isAuth,
  validate({ params: equipamentoParamsSchema }),
  equipamentoController.show
);

equipamentoRoutes.delete(
  "/equipamentos/:id",
  isAuth,
  validate({ params: equipamentoParamsSchema }),
  equipamentoController.delete
);

export default equipamentoRoutes;
