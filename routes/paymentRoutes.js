import express from "express";
import {
  initiatePayment,
  handlePaymentCallback,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment", initiatePayment);
router.post("/payment-callback", handlePaymentCallback);

export default router;
