import { BASE_URL } from "../../constants/url/baseURL.js";
import { ANALYTICS } from "../../constants/endpoints/analyticsPath.js";

const accessToken = sessionStorage.getItem("accessToken");

export const retrieveProductsSaleAPI = async () => {
	const res = await fetch(`${BASE_URL.baseURL}${ANALYTICS.analytics_data}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!res.ok) {
		return console.error("Couldn't fetch products sale.");
	}

	const data = await res.json();

	return data.details.soldProducts;
};
