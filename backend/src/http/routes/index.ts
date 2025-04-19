import { Router } from "express";
import armazemRoutes from "./armazem.routes";
import authRoutes from "./auth.routes";
import categoriaRoutes from "./categoria.routes";
import chartsRoutes from "./charts.routes";
import emprestimoRoutes from "./emprestimo.routes";
import estoqueRoutes from "./estoque.routes";
import insumoRoutes from "./insumo.routes";
import parceiroRoutes from "./parceiro.routes";
import requisicaoEstoqueRoutes from "./requisicaoEstoque.routes";
import requisitanteRoutes from "./requisitantes.routes";
import setorRoutes from "./setor.routes";
import userRoutes from "./user.routes";

const routes = Router();

routes.use("/api/v1/auth", authRoutes);
routes.use("/api/v1", userRoutes);
routes.use("/api/v1", categoriaRoutes);
routes.use("/api/v1", requisitanteRoutes);
routes.use("/api/v1", setorRoutes);
routes.use("/api/v1", insumoRoutes);
routes.use("/api/v1", requisicaoEstoqueRoutes);
routes.use("/api/v1", armazemRoutes);
routes.use("/api/v1", estoqueRoutes);
routes.use("/api/v1", emprestimoRoutes);
routes.use("/api/v1", parceiroRoutes);
routes.use("/api/v1", chartsRoutes);

export default routes;
