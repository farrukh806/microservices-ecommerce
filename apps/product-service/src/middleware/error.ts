import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong",
  });
};
