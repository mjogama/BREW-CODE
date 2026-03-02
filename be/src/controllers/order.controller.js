import * as orderService from "../services/order.service.js";
import ResponseHandler from "../helpers/ResponseHandler.js";

export const newCustomer = async (req, res) => {
	const { userId, username, purchasedProducts, totalAmount } = req.data;

	const purchasedInfo = {
		userId,
		username,
		purchasedProducts,
		totalAmount,
	};

	await orderService.newOrder(purchasedInfo);

	await ResponseHandler(res, "success", 201, {
		purchasedData: null,
		message: "Purchased successfully!",
	});
};
