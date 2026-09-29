import { Router } from "express";
import { login, logout, register, me } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../lib/http";

const router: Router = Router();

router.post("/login", asyncHandler(login));
router.post("/register", asyncHandler(register));
router.post("/logout", logout);
router.get("/me", authenticate, asyncHandler(me));

export default router;
