import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const routes = Router();

routes.use("/api/v1/auth", authRoutes);
routes.use("/api/v1", userRoutes);

export default routes;
