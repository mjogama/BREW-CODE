import asyncErrorHandler from "express-async-handler";

import * as productService from "../../services/product.service.js";
import ErrorHandler from "../../helpers/ErrorHandler.js";
import validateObjectId from "../../helpers/validateObjectId.js";

export const validateNewProduct = asyncErrorHandler(async (req, res, next) => {
	const { emoji, name, desc, price } = req.body;

	if (!emoji || !name || !desc || !price) {
		ErrorHandler("All fields are required", 400);
	}

	const product = await productService.retrieveProductByName(name);

	if (product) {
		ErrorHandler("This product name already exists", 409);
	}

	req.data = {
		emoji,
		name,
		desc,
		price,
	};

	next();
});

export const validateRetrieveProductById = asyncErrorHandler(async (req, res, next) => {
	const id = req.params.id;

	if (!id) {
		ErrorHandler("ID not found or Invalid", 400);
	}

	req.data = {
		id,
	};

	next();
});

export const validatePaginatedProducts = asyncErrorHandler(async (req, res, next) => {
	const { number } = req.query;

	if (!number) {
		ErrorHandler("Page not found", 404);
	}

	req.data = {
		number,
	};

	next();
});

export const validateUpdateProductById = asyncErrorHandler(async (req, res, next) => {
	const id = req.params.id;

	validateObjectId(id);

	const product = await productService.retrieveProductById(id);

	if (!product) {
		ErrorHandler("ID not found or Invalid", 404);
	}

	req.data = {
		id,
	};

	next();
});

export const validateDeleteProductById = asyncErrorHandler(async (req, res, next) => {
	const id = req.params.id;

	validateObjectId(id);

	const product = await productService.retrieveProductById(id);

	if (!product) {
		ErrorHandler("ID not found or Invalid", 404);
	}

	req.data = {
		id,
	};

	next();
});
