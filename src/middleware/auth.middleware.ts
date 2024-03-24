import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { verifyToken } from "../utils/jwt";
import db from "../utils/db";
import { User } from "@prisma/client";

export interface AuthRequest extends Request {
  user?: User | null;
}

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    if (
      req?.headers?.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // else if (req?.cookies?.token) {
    //   token = req.cookies.token;
    // }

    if (!token)
      return res.status(401).json({ error: "Not authorized to access" });

    try {
      const decoded = verifyToken(token);

      req.user = await db.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!req.user)
        return res.status(401).json({ error: "Not authorized to access" });

      next();
    } catch (error) {
      return res.status(401).json({ error });
    }
  }
);
