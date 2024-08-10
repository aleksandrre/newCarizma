// adminController.js
import { Product } from "../models/productModel.js";
import configureMulter from "../services/configureMulter.js";
import { deleteFileFromS3, uploadFilesToS3 } from "../services/s3Service.js";

// Controller function to add a product
export const addProduct = async (req, res) => {
  try {
    const uploadImages = configureMulter(4); // Set the maximum number of images per product

    // Call multer middleware to upload images
    await uploadImages(req, res);

    const { name, shortDescription, longDescription, quantity, price } =
      req.body;

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      // If a product with the same name exists, return a 400 response
      return res
        .status(400)
        .json({ error: "Product with this name already exists" });
    }

    // Get uploaded image URLs from req.files (uploaded by multer)
    const imageFiles = req.files;
    const imageUrls = await uploadFilesToS3(imageFiles);

    // Create a new product with uploaded image URLs
    const newProduct = new Product({
      name,
      shortDescription,
      longDescription,
      quantity,
      price,
      images: imageUrls, // Store the S3 URLs of the images
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Respond with the saved product
    res.status(201).json(savedProduct);
  } catch (error) {
    // Handle errors
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find and delete the product by ID
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      // If the product with the specified ID is not found, return a 404 response
      return res.status(404).json({ error: "Product not found" });
    }

    // Respond with the deleted product
    res.json(deletedProduct);
  } catch (error) {
    // Handle errors
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId; // Get product ID from request parameters

    // Call multer middleware to upload images
    const uploadImages = configureMulter(4); // Set the maximum number of images per product
    await uploadImages(req, res);

    const { name, shortDescription, longDescription, quantity, price } =
      req.body;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      // If product doesn't exist, return a 404 response
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product properties
    if (name) {
      // If name is provided, check if another product with the same name already exists
      if (name !== product.name) {
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
          return res
            .status(400)
            .json({ error: "Product with this name already exists" });
        }
        product.name = name;
      }
    }

    if (shortDescription) product.shortDescription = shortDescription;
    if (longDescription) product.longDescription = longDescription;
    if (quantity) product.quantity = quantity;
    if (price) product.price = price;

    // Check if there are new images uploaded
    if (req.files && req.files.length > 0) {
      // Handle the files

      // Delete old images from S3
      for (const oldImageUrl of product.images) {
        await deleteFileFromS3(oldImageUrl);
      }

      // Upload new images to S3 and get URLs
      const imageUrls = await uploadFilesToS3(req.files);

      // Update product images with new URLs
      product.images = imageUrls;
    }

    // Save the updated product
    const updatedProduct = await product.save();

    // Respond with the updated product
    res.json(updatedProduct);
  } catch (error) {
    // Handle errors
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
