import jwt from "jsonwebtoken";

export const accessToken = (userPayload) => {
	return jwt.sign(userPayload, process.env.ACCESS_TOKEN, { expiresIn: "1hr" });
};

export const refreshToken = (userPayload) => {
	return jwt.sign(userPayload, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};
