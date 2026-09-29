import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../lib/config";

interface JwtPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

/** Accepts the session cookie or an `Authorization: Bearer` token. */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    const expired = err instanceof jwt.TokenExpiredError;
    res.status(401).json({ error: expired ? "Session expired" : "Invalid session" });
  }
}
