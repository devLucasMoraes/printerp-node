import { Router } from "express";
import armazemRoutes from "./armazem.routes";
import authRoutes from "./auth.routes";
import categoriaRoutes from "./categoria.routes";
import equipamentoRoutes from "./equipamento.routes";
import insumoRoutes from "./insumo.routes";
import requisicaoEstoqueRoutes from "./requisicaoEstoque.routes";
import requisitanteRoutes from "./requisitantes.routes";
import userRoutes from "./user.routes";

const routes = Router();

routes.use("/api/v1/auth", authRoutes);
routes.use("/api/v1", userRoutes);
routes.use("/api/v1", categoriaRoutes);
routes.use("/api/v1", requisitanteRoutes);
routes.use("/api/v1", equipamentoRoutes);
routes.use("/api/v1", insumoRoutes);
routes.use("/api/v1", requisicaoEstoqueRoutes);
routes.use("/api/v1", armazemRoutes);

export default routes;
