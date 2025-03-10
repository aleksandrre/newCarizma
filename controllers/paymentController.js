import mongoose from "mongoose";
import { Payment } from "../models/PaymentModel.js";
import { createPayment } from "../services/paymentService.js";

export const initiatePayment = async (req, res) => {
  try {
    const { orderId, amount, email, phone, user_id } = req.body;

    // 🔥 გადაამოწმე, არსებობს თუ არა უკვე ეს order_id
    const existingPayment = await Payment.findOne({ order_id: orderId });
    if (existingPayment) {
      return res.status(400).json({
        error: "Order ID already exists. Please use a unique order_id.",
      });
    }

    // თუ order_id უნიკალურია, შექმენი გადახდის ჩანაწერი
    const payment = await Payment.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      order_id: orderId,
      amount,
      status: "pending",
      customer_email: email,
      customer_phone: phone,
    });

    const paymentData = await createPayment(orderId, amount, email, phone);
    res.json({ paymentUrl: paymentData.checkout_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Callback Endpoint - გადახდის სტატუსის განახლება
export const handlePaymentCallback = async (req, res) => {
  try {
    // const { order_id, amount, status, sender_email } = req.body;
    console.log(req.body);
    // გადახდის განახლება ბაზაში
    // await Payment.findOneAndUpdate({ order_id }, { status }, { new: true });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
