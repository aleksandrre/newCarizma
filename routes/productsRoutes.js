import express from "express";
import {
  getAllCategoryName,
  getAllProducts,
  getCategory,
  getOneProduct,
} from "../controllers/productController.js"; // Adjust the path based on your project structure

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getOneProduct);

router.get("/category/:name", getCategory);
router.get("/allCategoryNames", getAllCategoryName);

export default router;
