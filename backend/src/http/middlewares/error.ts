import { ErrorRequestHandler } from "express";
import { AppError } from "../../shared/errors";

export const globalErrorHandler: ErrorRequestHandler = (
  err: Error & Partial<AppError>,
  req,
  res,
  next
) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.statusCode ? err.message : "Internal Server Error";
  if (statusCode === 500) {
    console.log("------------------------------------");
    console.error(err);
    console.log("------------------------------------");
  }
  res.status(statusCode).json({ message });
};
