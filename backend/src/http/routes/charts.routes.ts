import { Router } from "express";
import { chartsController } from "../controllers/ChartsController";
import { isAuth } from "../middlewares/isAuth";

const chartsRoutes = Router();

chartsRoutes.get(
  "/charts/saidas-mensais",
  isAuth,
  chartsController.chartSaidasMensais
);

export default chartsRoutes;
