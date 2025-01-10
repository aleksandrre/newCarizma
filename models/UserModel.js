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

const wishListSchema = new mongoose.Schema({
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
  price: {
    type: Number,
    required: true,
  },
  sale: {
    type: Number,
    required: true,
    default: 0,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  address: {
    type: String,
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
  wishList: [wishListSchema],
  createdAt: {
    type: Date,
    default: Date.now, // Sets the current date when the document is created
  },
});

export const User = mongoose.model("users", userSchema);
