// adminController.js
import { Product } from "../models/productModel.js";
import { Category } from "../models/productModel.js"; // Adjust the path to your Category model

import configureMulter from "../services/configureMulter.js";
import { deleteFileFromS3, uploadFilesToS3 } from "../services/s3Service.js";

// Controller function to add a product
export const addCategory = async (req, res) => {
  try {
    // Destructure the name and description from the request body
    const { name, description } = req.body;

    // Check if the category name already exists in the database
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Category with this name already exists" });
    }

    // Create a new category
    const newCategory = new Category({
      name,
      description,
    });

    // Save the new category to the database
    const savedCategory = await newCategory.save();

    // Return the saved category in the response
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const uploadImages = configureMulter(4); // Set the maximum number of images per product

    // Call multer middleware to upload images
    await uploadImages(req, res);

    const {
      name,
      categories, // Assume this is an array of category ObjectIds
      description,
      mainPrice,
      isNewProduct,
      sale,
      isTopSale,
    } = req.body;

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Product with this name already exists" });
    }

    // Get uploaded image URLs from req.files (uploaded by multer)
    const imageFiles = req.files;
    const imageUrls = await uploadFilesToS3(imageFiles);

    // Create a new product without colors
    const newProduct = new Product({
      name,
      categories: Array.isArray(JSON.parse(categories))
        ? JSON.parse(categories)
        : [], // Ensure this is an array of ObjectIds
      description,
      images: imageUrls, // Store the S3 URLs of the images
      mainPrice,
      isNewProduct,
      sale,
      isTopSale,
    });

    console.log(categories);
    console.log(Array.isArray(JSON.parse(categories)));
    console.log(JSON.parse(categories));

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Update each category with the new product
    const categoryIds = Array.isArray(JSON.parse(categories))
      ? JSON.parse(categories)
      : [];
    await Category.updateMany(
      { _id: { $in: categoryIds } },
      { $push: { products: savedProduct._id } }
    );

    // Respond with the product ID
    res.status(201).json({ productId: savedProduct._id });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addColorToProduct = async (req, res) => {
  try {
    const uploadImage = configureMulter(1); // Set the maximum number of images per color

    // Call multer middleware to upload the color image
    await uploadImage(req, res);

    const { productId, colorName, colorPrice, quantity, sale } = req.body;

    // Get uploaded image URL from req.files (uploaded by multer)
    const imageFiles = req.file;
    const imageUrl = await uploadFilesToS3(imageFiles[0]); // Assuming one image per color

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create a new color object
    const newColor = {
      colorName,
      colorPrice,
      quantity,
      sale,
      image: imageUrl,
    };

    // Add the new color to the product's colors array
    product.colors.push(newColor);

    // Save the updated product
    const updatedProduct = await product.save();

    // Respond with the updated product
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error adding color to product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find and delete the product by ID
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete the product images and color images from S3
    await deleteFilesFromS3(deletedProduct.images);
    const colorImages = deletedProduct.colors.map((color) => color.image);
    await deleteFilesFromS3(colorImages);

    res
      .status(200)
      .json({ message: "Product and its colors deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteColorFromProductById = async (req, res) => {
  try {
    const { productId, colorId } = req.params;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the color in the colors array and remove it
    const colorIndex = product.colors.findIndex(
      (color) => color._id.toString() === colorId
    );

    if (colorIndex === -1) {
      return res.status(404).json({ error: "Color not found" });
    }

    const [deletedColor] = product.colors.splice(colorIndex, 1);

    // Delete the associated color image from S3
    await deleteFilesFromS3([deletedColor.image]);

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Color deleted successfully", product });
  } catch (error) {
    console.error("Error deleting color:", error);
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
