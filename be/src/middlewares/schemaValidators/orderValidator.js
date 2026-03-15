import asyncErrorHandler from "express-async-handler";

import * as orderService from "../../services/order.service.js";
import ErrorHandler from "../../helpers/errorHandler.js";
import validateObjectId from "../../helpers/validateObjectId.js";

export const validateNewOrder = asyncErrorHandler(async (req, res, next) => {
	const userId = req.data?.userId;
	const { purchasedProducts, totalAmount } = req.body;

	if (!userId || !purchasedProducts || !totalAmount) {
		ErrorHandler("No data found", 400);
	}

	req.data = {
		userId,
		purchasedProducts,
		totalAmount,
	};

	next();
});

export const validateTotalCustomersOrder = asyncErrorHandler(async (req, res, next) => {
	const { data } = req;

	if (!data) {
		ErrorHandler("No data found", 404);
	}

	const totalOrders = await orderService.totalOrders();

	req.data = totalOrders;

	next();
});

export const validateTotalRevenue = asyncErrorHandler(async (req, res, next) => {
	const { data } = req;

	if (!data) {
		ErrorHandler("No data found", 404);
	}

	const totalRevenue = await orderService.totalRevenue();

	req.data = totalRevenue;

	next();
});

export const validateDeleteOrder = asyncErrorHandler(async (req, res, next) => {
	const id = req.params.id;

	validateObjectId(id);

	const order = await orderService.retrieveOrderById(id);

	if (!order) {
		ErrorHandler("ID not found or Invalid", 404);
	}

	req.data = {
		id,
	};

	next();
});
