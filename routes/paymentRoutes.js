import express from "express";
import {
  initiatePayment,
  handlePaymentCallback,
} from "../controllers/paymentController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-payment", authenticateToken, initiatePayment);
router.post("/payment-callback", handlePaymentCallback);

export default router;
