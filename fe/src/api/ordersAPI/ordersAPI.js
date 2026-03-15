import { BASE_URL } from "../../constants/url/baseURL.js";
import { ORDERS } from "../../constants/endpoints/ordersPath.js";

const accessToken = sessionStorage.getItem("accessToken");

export const retrieveOrdersData = async () => {
	if (!accessToken) {
		window.location.href = "./login.html";
		return;
	}

	const res = await fetch(`${BASE_URL.baseURL}${ORDERS.retrieveOrdersDataPath}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!res.ok) {
		window.location.href = "./login.html";
		return;
	}

	return await res.json();
};

export const deleteOrderData = async (orderId) => {
	const res = await fetch(`${BASE_URL.baseURL}${ORDERS.deleteOrderDataPath}/${orderId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		method: "DELETE",
	});

	const data = await res.json();

	return data.details;
};
