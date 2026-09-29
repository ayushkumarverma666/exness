import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodError } from "zod";
import type { EngineStatus } from "@repo/types";

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

export function validationError(res: Response, error: ZodError) {
  const issue = error.issues[0];
  const field = issue?.path.join(".");
  return res.status(400).json({
    error: field ? `${field}: ${issue?.message}` : issue?.message || "Invalid request",
  });
}

export const engineStatusCode: Record<EngineStatus, number> = {
  created: 200,
  closed: 200,
  deposited: 200,
  invalid_order: 400,
  no_price: 503,
  insufficient_balance: 400,
  order_not_found: 404,
  limit_exceeded: 400,
  error: 502,
};

export const num = (v: unknown) => (v == null ? null : Number(v));
