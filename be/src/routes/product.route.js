import express from "express";

import * as productController from "../controllers/product.controller.js";
import { validateNewProduct, validatePaginatedProducts, validateUpdateProductById, validateDeleteProductById } from "../middlewares/schemaValidators/productValidator.js";

const router = express.Router();

router.post("/new", validateNewProduct, productController.createNewProduct);
router.get("/", productController.retrieveAllProducts);
// router.get("/data/:id", validateRetrieveProductById, productController.retrieveProductByName);
router.get("/total-products", productController.retrieveTotalProducts);
router.get("/page", validatePaginatedProducts, productController.retrievePaginatedProducts);
router.patch("/edit/:id", validateUpdateProductById, productController.updateProductById);
router.delete("/delete/:id", validateDeleteProductById, productController.deleteProductById);

export default router;
