import { Router } from "express";
import authRoutes from "./auth.routes";
import categoriaRoutes from "./categoria.routes";
import equipamentoRoutes from "./equipamento.routes";
import insumoRoutes from "./insumo.routes";
import requisitanteRoutes from "./requisitantes.routes";
import userRoutes from "./user.routes";

const routes = Router();

routes.use("/api/v1/auth", authRoutes);
routes.use("/api/v1", userRoutes);
routes.use("/api/v1", categoriaRoutes);
routes.use("/api/v1", requisitanteRoutes);
routes.use("/api/v1", equipamentoRoutes);
routes.use("/api/v1", insumoRoutes);

export default routes;
