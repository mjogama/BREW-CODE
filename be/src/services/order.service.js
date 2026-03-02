import OrderModel from "../models/OrderModel.js";

export const newOrder = async (data) => {
	return await OrderModel.create(data);
};
