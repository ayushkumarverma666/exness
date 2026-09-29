import { Router } from "express";
import { closeOrder, createOrder, getOrders, getOrderById, getStats } from "../controllers/trade.controller";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../lib/http";

const router: Router = Router();

router.use(authenticate);

router.post("/open", asyncHandler(createOrder));
router.post("/close/:orderId", asyncHandler(closeOrder));
router.get("/orders", asyncHandler(getOrders));
router.get("/orders/:orderId", asyncHandler(getOrderById));
router.get("/stats", asyncHandler(getStats));

export default router;
