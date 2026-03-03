import asyncErrorHandler from "express-async-handler";

import * as orderService from "../../services/order.service.js";
import ErrorHandler from "../../helpers/errorHandler.js";

export const validateNewOrder = asyncErrorHandler(async (req, res, next) => {
	const userId = req.data?.userId;
	const { username, purchasedProducts, totalAmount } = req.body;

	if (!userId || !username || !purchasedProducts || !totalAmount) {
		ErrorHandler("No data found", 400);
	}

	req.data = {
		userId,
		username,
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
