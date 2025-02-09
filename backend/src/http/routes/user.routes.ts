import { Router } from "express";
import { UserServiceImpl } from "../../services/user/UserServiceImpl";
import { UserController } from "../controllers/UserController";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import {
  userCreateSchema,
  userParamsSchema,
  userQuerySchema,
  userUpdateSchema,
} from "../validators/user.schemas";

const userService = new UserServiceImpl();
const userController = new UserController(userService);

const userRoutes = Router();

userRoutes.get("/users-all", isAuth, userController.list);

userRoutes.get(
  "/users",
  isAuth,
  validate({ query: userQuerySchema }),
  userController.listPaginated
);

userRoutes.post(
  "/users",
  isAuth,
  validate({ body: userCreateSchema }),
  userController.create
);

userRoutes.put(
  "/users/:id",
  isAuth,
  validate({ body: userUpdateSchema, params: userParamsSchema }),
  userController.update
);

userRoutes.get(
  "/users/:id",
  isAuth,
  validate({ params: userParamsSchema }),
  userController.show
);

userRoutes.delete(
  "/users/:id",
  isAuth,
  validate({ params: userParamsSchema }),
  userController.delete
);

export default userRoutes;
