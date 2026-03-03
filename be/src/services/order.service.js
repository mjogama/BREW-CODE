import OrderModel from "../models/OrderModel.js";

export const newOrder = async (data) => {
	return await OrderModel.create(data);
};

export const totalOrders = async () => {
	return await OrderModel.countDocuments();
};

export const totalRevenue = async () => {
	const result = await OrderModel.aggregate([
		{ $group: { _id: null, total: { $sum: "$totalAmount" } } },
	]);
	return result[0]?.total ?? 0;
};
