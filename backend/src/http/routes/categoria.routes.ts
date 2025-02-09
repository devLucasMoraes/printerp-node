import { Router } from "express";
import { CategoriaServiceImpl } from "../../services/categoria/CategoriaServiceImpl";
import { CategoriaController } from "../controllers/CategoriaController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  categoriaCreateSchema,
  categoriaParamsSchema,
  categoriaQuerySchema,
  categoriaUpdateSchema,
} from "../validators/categoria.schemas";

const categoriaService = new CategoriaServiceImpl();
const categoriaController = new CategoriaController(categoriaService);

const categoriaRoutes = Router();

categoriaRoutes.get("/categorias-all", isAuth, categoriaController.list);

categoriaRoutes.get(
  "/categorias",
  isAuth,
  validate({ query: categoriaQuerySchema }),
  categoriaController.listPaginated
);

categoriaRoutes.post(
  "/categorias",
  isAuth,
  validate({ body: categoriaCreateSchema }),
  categoriaController.create
);

categoriaRoutes.put(
  "/categorias/:id",
  isAuth,
  validate({ body: categoriaUpdateSchema, params: categoriaParamsSchema }),
  categoriaController.update
);

categoriaRoutes.get(
  "/categorias/:id",
  isAuth,
  validate({ params: categoriaParamsSchema }),
  categoriaController.show
);

categoriaRoutes.delete(
  "/categorias/:id",
  isAuth,
  validate({ params: categoriaParamsSchema }),
  categoriaController.delete
);

export default categoriaRoutes;
