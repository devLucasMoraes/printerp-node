import { Router } from "express";
import { validate } from "../middlewares/validate";

import { AuthenticationServiceImpl } from "../../services/auth/AuthenticationServiceImpl";
import { UserServiceImpl } from "../../services/user/UserServiceImpl";
import { AuthController } from "../controllers/AuthController";
import { UserController } from "../controllers/UserController";
import { isAuth } from "../middlewares/isAuth";
import { loginSchema, signUpSchema } from "../validators/auth.schema";

const authenticationUseCase = new AuthenticationServiceImpl();

const authController = new AuthController(authenticationUseCase);

const userService = new UserServiceImpl();

const userController = new UserController(userService);

const authRoutes = Router();

authRoutes.post(
  "/signup",
  validate({ body: signUpSchema }),
  userController.create
);

authRoutes.post(
  "/login",
  validate({ body: loginSchema }),
  authController.login
);

authRoutes.post("/refresh", authController.refresh);

authRoutes.post("/logout", isAuth, authController.logout);

authRoutes.get("/me", isAuth, async (req, res) => {
  res.json({ user: req.user });
});

export default authRoutes;
