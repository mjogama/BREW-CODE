import asyncErrorHandler from "express-async-handler";
import bcrypt from "bcrypt";

import * as userService from "../../services/user.service.js";
import ErrorHandler from "../../helpers/errorHandler.js";
import userSchema from "../../schemas/user.schema.js";

export const validateSignup = asyncErrorHandler(async (req, res, next) => {
	const responseSchema = await userSchema.safeParseAsync(req.body);

	if (!responseSchema.success) {
		const message = responseSchema.error.issues.map((e) => e.message);
		const path = responseSchema.error.issues.map((e) => `${e.path[0]}Error`);

		ErrorHandler(message, 400, ...path);
	}

	const { fullName, email, password, agreeTerms } = responseSchema.data;

	const user = await userService.isEmailExist(email);

	if (user) {
		ErrorHandler("This email already exist", 409);
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	req.data = {
		fullName,
		email,
		hashedPassword,
		agreeTerms,
	};

	next();
});

export const validateLogin = asyncErrorHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		ErrorHandler("All fields are required", 400);
	}

	const user = await userService.loginData(email);

	if (!user) {
		ErrorHandler("Invalid email or password", 404);
	}

	const matchedPassword = await bcrypt.compare(password, user.password);

	if (!matchedPassword) {
		ErrorHandler("Invalid email or password", 404);
	}

	const ALLOWED_LOGIN_ROLES = ["customer", "admin"];

	if (!user.role || !ALLOWED_LOGIN_ROLES.includes(user.role)) {
		ErrorHandler("Login not allowed for your account type", 403);
	}

	req.data = user;

	next();
});

export const validateRetrieveUserData = asyncErrorHandler(async (req, res, next) => {
	const { data } = req;

	if (!data) {
		ErrorHandler("No data found", 404);
	}

	req.data = data;

	next();
});

export const validateRetrieveAdminData = asyncErrorHandler(async (req, res, next) => {
	const { data } = req;

	if (!data) {
		ErrorHandler("No data found", 404);
	}

	const totalCustomers = await userService.retrieveTotalCustomer();

	req.data = {
		data,
		totalCustomers,
	};

	next();
});
