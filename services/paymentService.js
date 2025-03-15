import crypto from "crypto";
import dotenv from "dotenv";
import CloudIpsp from "cloudipsp-node-js-sdk";
dotenv.config();

// ✅ Signature-ის სწორად გენერაციის ფუნქცია
const generateSignature = (data) => {
  const secretKey = process.env.SECRET_KEY;
  let signatureString = [secretKey]; // პირველ რიგში ვამატებთ secretKey-ს

  // ანბანური წესით დალაგება და ცარიელი პარამეტრების ამოღება
  Object.keys(data)
    .sort()
    .forEach((key) => {
      if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
        signatureString.push(data[key]);
      }
    });

  const finalString = signatureString.join("|"); // საბოლოო signature-ის სტრიქონი
  console.log("Signature String:", finalString); // Debugging
  return crypto.createHash("sha1").update(finalString).digest("hex"); // SHA1 hash
};

const fondy = new CloudIpsp({
  merchantId: process.env.MERCHANT_ID,
  secretKey: process.env.SECRET_KEY,
});

export const createPayment = async (orderId, amount, email, phone) => {
  const requestData = {
    merchant_id: process.env.MERCHANT_ID,
    order_id: orderId,
    order_desc: "Carizma Order",
    currency: "GEL",
    amount: amount * 100, // თეთრებში
    server_callback_url:
      "https://newcarizma.onrender.com/payments/payment-callback",
  };

  // ✅ Signature-ის გენერაცია და დამატება
  requestData.signature = generateSignature(requestData);

  console.log("Final Request Data:", requestData); // Debugging

  try {
    const response = await fondy.Checkout(requestData);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
