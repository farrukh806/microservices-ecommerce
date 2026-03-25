import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const validationErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  next,
) => {
  if (!(err instanceof ZodError)) {
    next(err);
    return;
  }

  res.status(400).json({
    error: "Validation failed",
    issues: err.issues.map((issue) => ({
      path: issue.path.length ? issue.path.join(".") : "(root)",
      message: issue.message,
      code: issue.code,
    })),
  });
};
