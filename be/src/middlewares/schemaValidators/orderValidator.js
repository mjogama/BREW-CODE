import asyncErrorHandler from "express-async-handler";

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
