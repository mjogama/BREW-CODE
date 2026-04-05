import { BASE_URL } from "../../constants/url/baseURL.js";
import { LOGIN } from "../../constants/endpoints/loginPath.js";

export const loginAPI = async (data) => {
	const res = await fetch(`${BASE_URL.baseURL}${LOGIN.login}`, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(data),
	});

	return await res.json();
};
