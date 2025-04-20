import { Router } from "express";
import { chartsController } from "../controllers/ChartsController";
import { isAuth } from "../middlewares/isAuth";

const chartsRoutes = Router();

chartsRoutes.get(
  "/charts/saidas-mensais",
  isAuth,
  chartsController.chartSaidasMensais
);

chartsRoutes.get(
  "/charts/insumos-por-setor/:periodo",
  isAuth,
  chartsController.chartInsumosPorSetor
);

export default chartsRoutes;
