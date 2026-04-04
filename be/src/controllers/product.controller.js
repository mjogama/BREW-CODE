import asyncErrorHandler from "express-async-handler";

import * as productService from "../services/product.service.js";
import ResponseHandler from "../helpers/ResponseHandler.js";

export const createNewProduct = asyncErrorHandler(async (req, res) => {
	const { emoji, name, desc, price } = req.data;

	const data = await productService.createNewProduct({
		emoji,
		name,
		desc,
		price,
	});

	ResponseHandler(res, "success", 201, {
		message: "Created new product successfully!",
		data,
	});
});

export const retrieveAllProducts = asyncErrorHandler(async (req, res) => {
	const data = await productService.retrieveProducts();

	ResponseHandler(res, "success", 200, {
		message: "Retrieve data successfully!",
		data,
	});
});

export const retrieveProductByName = asyncErrorHandler(async (req, res) => {
	const { id } = req.data;

	const data = await productService.retrieveProductByName(id);

	ResponseHandler(res, "success", 200, {
		message: "Retrieve data successfully!",
		data,
	});
});

export const retrieveTotalProducts = asyncErrorHandler(async (req, res) => {
	const totalProducts = await productService.totalProducts();

	ResponseHandler(res, "success", 200, {
		message: "Retrieve data successfully!",
		totalProducts,
	});
});

export const retrievePaginatedProducts = asyncErrorHandler(async (req, res) => {
	const { number } = req.data;

	const data = await productService.retrievePaginatedProducts(number);

	ResponseHandler(res, "success", 200, {
		data,
		number,
		message: `Retrieve page ${number} successfully`,
	});
});

export const updateProductById = asyncErrorHandler(async (req, res) => {
	const { id } = req.data;

	const data = await productService.updateProductById(id, req.body);

	ResponseHandler(res, "success", 200, {
		message: "Retrieve data successfully!",
		data,
	});
});

export const deleteProductById = asyncErrorHandler(async (req, res) => {
	const { id } = req.data;

	await productService.deleteProductById(id);

	ResponseHandler(res, "success", 200, {
		message: "Deleted product successfully!",
		data: null,
	});
});
