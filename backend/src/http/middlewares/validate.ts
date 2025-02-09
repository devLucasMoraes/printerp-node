import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { BadRequestError } from "../../shared/errors";

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (schemas: ValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar `req.body` se o esquema estiver definido
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      // Validar `req.query` se o esquema estiver definido
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }

      // Validar `req.params` se o esquema estiver definido
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return next(new BadRequestError(formattedErrors));
      }

      next(error);
    }
  };
};
