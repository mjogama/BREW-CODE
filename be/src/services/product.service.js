import ProductModel from "../models/ProductModel.js";

export const createNewProduct = async (product) => {
	return await ProductModel.create(product);
};

export const retrieveProducts = async () => {
	return await ProductModel.find();
};

export const retrieveProductById = async (id) => {
	return await ProductModel.findOne({ _id: id });
};

export const retrieveProductByName = async (productName) => {
	return await ProductModel.findOne({ name: productName });
};

export const retrievePaginatedProducts = async (page) => {
	const limit = 8;
	const skip = (page - 1) * limit;
	return await ProductModel.find({}).skip(skip).limit(limit);
};

export const updateProductById = async (id, reqBody) => {
	return await ProductModel.findOneAndUpdate({ _id: id }, reqBody, { returnDocument: "after" });
};

export const deleteProductById = async (id) => {
	return await ProductModel.findOneAndDelete({ _id: id });
};

export const totalProducts = async () => {
	return await ProductModel.countDocuments();
};
