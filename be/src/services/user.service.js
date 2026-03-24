import UserModel from "../models/UserModel.js";

export const signupData = async (data) => {
	return await UserModel.create(data);
};

export const loginData = async (email) => {
	return await UserModel.findOne({ email: email });
};

export const retrieveCustomers = async () => {
	return await UserModel.find();
};

export const retrieveTotalCustomer = async () => {
	return await UserModel.countDocuments();
};

export const deleteCustomer = async (id) => {
	return await UserModel.findOneAndDelete({ _id: id });
};

export const isEmailExist = async (email) => {
	return await UserModel.findOne({ email: email });
};
