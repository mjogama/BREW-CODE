import jwt from "jsonwebtoken";

import ErrorHandler from "../helpers/ErrorHandler.js";
import jwtErrorHandler from "../helpers/jwtErrorHandler.js";

const authToken = (req, res, next) => {
	try {
		const headers = req.headers.Authorization || req.headers.authorization;
		const token = headers && headers.split(" ")[1];

		if (!token) {
			ErrorHandler("Token not found", 401);
		}

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

		const userData = {
			userId: decoded._id,
			fullName: decoded.fullName,
			email: decoded.email,
			agreeTerms: decoded.agreeTerms,
			role: decoded.role,
		};

		req.data = userData;
		next();
	} catch (error) {
		jwtErrorHandler(error.message);
	}
};

export default authToken;
