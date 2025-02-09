import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import { globalErrorHandler } from "./http/middlewares/error";
import routes from "./http/routes/";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(routes);
app.use(globalErrorHandler);

export default app;
