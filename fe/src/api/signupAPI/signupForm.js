import { BASE_URL } from "../../constants/url/baseURL.js";
import { SIGNUP } from "../../constants/endpoints/signupPath.js";

export const signupAPI = async (data) => {
	const res = await fetch(`${BASE_URL.baseURL}${SIGNUP.signup}`, {
		headers: { "Content-Type": "application/json" },
		method: "POST",
		body: JSON.stringify(data),
		credentials: "include",
	});

	return await res.json();
};
