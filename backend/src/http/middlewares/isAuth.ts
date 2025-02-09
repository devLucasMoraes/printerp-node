import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../../config/auth";
import { userRepository } from "../../domain/repositories";
import { UnauthorizedError } from "../../shared/errors";

export const isAuth: RequestHandler = async (req, res, next) => {
  const accesstoken = req.cookies[authConfig.accessTokenCookieName];

  if (!accesstoken) {
    throw new UnauthorizedError("Missing token");
  }

  try {
    const { id } = jwt.verify(
      accesstoken,
      authConfig.accessTokenSecret ?? ""
    ) as {
      id: string;
    };

    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Token expired");
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid token");
    }
    throw err;
  }

  next();
};
