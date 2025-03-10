import crypto from "crypto";
import dotenv from "dotenv";
import CloudIpsp from "cloudipsp-node-js-sdk";
dotenv.config();

// Signature-ის გენერაციის ფუნქცია
const generateSignature = (data) => {
  const secretKey = process.env.SECRET_KEY; // Secret Key .env-დან
  const values = Object.values(data).join("|"); // სწორად დალაგებული პარამეტრები
  return crypto
    .createHash("sha1")
    .update(values + secretKey)
    .digest("hex");
};

const fondy = new CloudIpsp({
  merchantId: process.env.MERCHANT_ID,
  secretKey: process.env.SECRET_KEY,
});

export const createPayment = async (orderId, amount, email, phone) => {
  const requestData = {
    // merchant_id: process.env.MERCHANT_ID,
    order_id: orderId,
    order_desc: "Carizma Order",
    currency: "GEL",
    amount: amount * 100, // თეთრებში
    server_callback_url:
      "https://newcarizma.onrender.com/payments/payment-callback",
  };

  // ✅ Signature-ის სწორად გენერაცია
  requestData.signature = generateSignature(requestData);

  try {
    const response = await fondy.Checkout(requestData);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
