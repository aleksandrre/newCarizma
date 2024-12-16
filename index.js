// Import necessary modules
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { User } from "./models/userModel.js";
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import bcrypt from "bcryptjs";

const PORT = process.env.PORT || 3001;

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/email", emailRoutes);
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/cart", cartRoutes);

// Database connection
mongoose
  .connect(MONGODB_URI, {})
  .then(() => {
    console.log("Successfully connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`App is listening on ${PORT} port`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// async function createAdminUser() {
//   try {
//     // Check if an admin user already exists

//     // Generate a random token for email verification

//     // Hash the default admin password using bcrypt
//     const adminPassword = "123"; // Change this to a secure password
//     const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

//     // Create a new admin user with the hashed password and email verification token
//     const adminUser = new User({
//       username: "admin", // Change this to the desired admin username
//       password: hashedAdminPassword,
//       email: "admin@example.com", // Change this to the desired admin email
//       isAdmin: true,
//       emailVerified: true,
//     });

//     // Save the admin user to the database
//     await adminUser.save();

//     console.log("Admin user registered successfully.");
//   } catch (error) {
//     console.error("Error creating admin user:", error);
//   }
// }

//cors პრობლემა თუ მექნება შეიძლება bucket permission cors ი უნდა გავასწორო და ჩავწერო შიგნით cors კოდი
