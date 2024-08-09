import express from "express";

const router = express.Router();
import {
  addProduct,
  deleteProductById,
  updateProduct,
} from "../controllers/adminController.js"; // Adjust the path based on your project structure
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdminMiddleware .js";

router.post("/add-product", authenticateToken, isAdmin, addProduct);
router.delete(
  "/delete-product/:id",
  authenticateToken,
  isAdmin,
  deleteProductById
);
router.put("/products/:productId", authenticateToken, isAdmin, updateProduct);

export default router;
