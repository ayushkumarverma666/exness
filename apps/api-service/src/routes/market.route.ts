import { Router } from "express";
import { getCandles, getDepth, getTickers, getTrades } from "../controllers/market.controller";
import { asyncHandler } from "../lib/http";

const router: Router = Router();

router.get("/tickers", asyncHandler(getTickers));
router.get("/candles", asyncHandler(getCandles));
router.get("/depth/:symbol", asyncHandler(getDepth));
router.get("/trades/:symbol", asyncHandler(getTrades));

export default router;
