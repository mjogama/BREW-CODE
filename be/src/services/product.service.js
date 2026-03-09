import ProductModel from "../models/ProductModel.js";

export const createNewProduct = async (product) => {
	return await ProductModel.create(product);
};

export const retrieveProducts = async () => {
	return await ProductModel.find().sort({ createdAt: -1 });
};

export const retrieveProductById = async (id) => {
	return await ProductModel.findOne({ _id: id });
};

export const retrieveProductByName = async (productName) => {
	return await ProductModel.findOne({ name: productName });
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
