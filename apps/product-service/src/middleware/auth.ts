import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = getAuth(req);

  if (!auth.userId)
    return res.status(401).json({ message: "User is not authenticated" });
  req.userId = auth.userId
  next();
};
