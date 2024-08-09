// routes/authRoutes.js
import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/login", authController.login);
router.get("/token", authController.token);
router.post("/logout", authController.logout);

export default router;
