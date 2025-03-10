import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // 🔥 აქ ObjectId უნდა იყოს, არა string!
      ref: "User",
      required: true,
    },
    customer_email: { type: String, required: true },
    customer_phone: { type: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
