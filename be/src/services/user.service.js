import UserModel from "../models/UserModel.js";

export const signupData = async (data) => {
	return await UserModel.create(data);
};

export const loginData = async (email) => {
	return await UserModel.findOne({ email: email });
};

export const isEmailExist = async (email) => {
	return await UserModel.findOne({ email: email });
};

export const retrieveTotalCustomer = async () => {
	return await UserModel.countDocuments();
};
