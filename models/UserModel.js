import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  // ფერთან დაკავშირებული ველები optional არის
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  colorName: String,
  colorImage: String,
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  sale: {
    type: Number,
    required: true,
    default: 0,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  resetToken: String,
  resetTokenExpires: Date,
  cart: [cartItemSchema],
});

export const User = mongoose.model("users", userSchema);
