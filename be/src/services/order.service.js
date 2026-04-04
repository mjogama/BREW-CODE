import OrderModel from "../models/OrderModel.js";

export const newOrder = async (data) => {
	return await OrderModel.create(data);
};

export const retrieveOrders = async () => {
	return await OrderModel.aggregate([
		{
			$lookup: {
				from: "brew-code-users",
				localField: "userId",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$unwind: "$user",
		},
		{
			$project: {
				"user.email": 0,
				"user.password": 0,
				"user.agreeTerms": 0,
				"user.role": 0,
				"user.createdAt": 0,
				"user.updatedAt": 0,
			},
		},
	]).sort({ createdAt: -1 });
};

export const retrieveOrderById = async (id) => {
	return await OrderModel.findOne({ _id: id });
};

export const totalOrders = async () => {
	return await OrderModel.countDocuments();
};

export const totalRevenue = async () => {
	const result = await OrderModel.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]);
	return result[0]?.total ?? 0;
};

export const productsSold = async () => {
	return OrderModel.aggregate([
		{ $unwind: "$purchasedProducts" },
		{
			$group: {
				_id: "$purchasedProducts.productName",
				productsSold: { $sum: "$purchasedProducts.quantity" },
			},
		},
		{
			$project: {
				_id: 0,
				name: "$_id",
				productsSold: 1,
			},
		},
		{ $sort: { productsSold: -1 } },
	]);
};

export const retrievePaginatedOrders = async (page) => {
	const limit = 8;
	const skip = (page - 1) * limit;
	return await OrderModel.aggregate([
		{
			$lookup: {
				from: "brew-code-users",
				localField: "userId",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$unwind: "$user",
		},
		{
			$project: {
				"user.email": 0,
				"user.password": 0,
				"user.agreeTerms": 0,
				"user.role": 0,
				"user.createdAt": 0,
				"user.updatedAt": 0,
			},
		},
		{
			$sort: { createdAt: -1 },
		},
		{
			$skip: skip,
		},
		{
			$limit: limit,
		},
	]);
};

export const updateOrderStatus = async (id, reqBody) => {
	return await OrderModel.findOneAndUpdate({ _id: id }, reqBody, { returnDocument: "after" });
};

export const deleteOrder = async (id) => {
	return await OrderModel.findOneAndDelete({ _id: id });
};
