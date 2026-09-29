import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/prisma";
import { LoginSchema, RegisterSchema } from "../schemas/auth.type";
import { config } from "../lib/config";
import { validationError } from "../lib/http";
import { engine } from "../lib/engineClient";

/** Every new demo account starts with this much virtual USDC. */
const STARTING_BALANCE = 10_000;

function startSession(res: Response, user: { id: string; email: string; name: string }) {
  const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: config.cookieSameSite,
    secure: config.cookieSecure,
    maxAge: config.sessionMaxAgeMs,
    path: "/",
  });
  return { user: { id: user.id, email: user.email, name: user.name }, token };
}

export const login = async (req: Request, res: Response) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) return validationError(res, result.error);
  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  let valid = false;
  if (user) {
    if (user.password.startsWith("$2")) {
      valid = await bcrypt.compare(password, user.password);
    } else if (user.password === password) {
      // Legacy plain-text password: upgrade it to a hash on successful login.
      valid = true;
      await prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(password, 12) },
      });
    }
  }
  if (!user || !valid) {
    return res.status(401).json({ error: "Incorrect email or password" });
  }
  res.json({ message: "Logged in", ...startSession(res, user) });
};

export const register = async (req: Request, res: Response) => {
  const result = RegisterSchema.safeParse(req.body);
  if (!result.success) return validationError(res, result.error);
  const { name, email, password } = result.data;

  if (await prisma.user.findUnique({ where: { email } })) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }
  const user = await prisma.user.create({
    data: { email, name, password: await bcrypt.hash(password, 12) },
  });
  const credit = await engine.send("deposit", { userId: user.id, amount: STARTING_BALANCE });
  if (credit.status !== "deposited") {
    console.warn(`[auth] starting balance for ${user.id} failed: ${credit.message}`);
  }
  res.status(201).json({ message: "Account created", ...startSession(res, user) });
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: config.cookieSameSite,
    secure: config.cookieSecure,
    path: "/",
  });
  res.json({ message: "Logged out" });
};

export const me = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  if (!user) return res.status(401).json({ error: "Account no longer exists" });
  res.json({ user });
};
