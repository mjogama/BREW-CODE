import asyncErrorHandler from "express-async-handler";

import * as userService from "../services/user.service.js";
import { accessToken, refreshToken } from "../utils/accessToken.js";
import ResponseHandler from "../helpers/ResponseHandler.js";

export const signupUser = asyncErrorHandler(async (req, res) => {
	const { fullName, email, hashedPassword, agreeTerms } = req.data;

	await userService.signupData({
		fullName,
		email,
		password: hashedPassword,
		agreeTerms,
	});

	ResponseHandler(res, "success", 201, {
		data: null,
		message: "Created successfully",
	});
});

export const loginUser = asyncErrorHandler(async (req, res) => {
	const user = req.data;

	const userPayload = {
		_id: user._id,
		fullName: user.fullName,
		email: user.email,
		agreeTerms: user.agreeTerms,
		role: user.role,
	};

	const token = accessToken(userPayload);

	const rfToken = refreshToken(userPayload);

	ResponseHandler(res, "success", 200, {
		data: null,
		token: token,
		rfToken: rfToken,
		message: "Login successfully",
	});
});

export const retrieveUserData = asyncErrorHandler(async (req, res) => {
	const data = req.data;

	ResponseHandler(res, "success", 200, {
		data,
		message: "Hello! Welcome to Brew & Code",
	});
});

export const retrieveCustomers = asyncErrorHandler(async (req, res) => {
	const data = req.data;

	ResponseHandler(res, "success", 200, {
		data,
		message: "Created successfully",
	});
});

export const retrieveAdminData = asyncErrorHandler(async (req, res) => {
	const { data, totalCustomers } = req.data;

	ResponseHandler(res, "success", 200, {
		data,
		totalCustomers,
		message: "Created successfully",
	});
});

export const retrievePaginatedUsers = asyncErrorHandler(async (req, res) => {
	const { number } = req.data;

	const data = await userService.retrievePaginatedCustomers(number);

	ResponseHandler(res, "success", 200, {
		data,
		number,
		message: `Retrieve page ${number} successfully`,
	});
});

export const deleteCustomerData = asyncErrorHandler(async (req, res) => {
	const { id } = req.data;

	await userService.deleteCustomer(id);
	ResponseHandler(res, "sucess", 200, {
		message: "Deleted customer successfully!",
	});
});
