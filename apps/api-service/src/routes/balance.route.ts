import { Router } from "express";
import { getBalance, depositBalance, getTransactions } from "../controllers/balance.controller";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../lib/http";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(getBalance));
router.post("/deposit", asyncHandler(depositBalance));
router.get("/transactions", asyncHandler(getTransactions));

export default router;
