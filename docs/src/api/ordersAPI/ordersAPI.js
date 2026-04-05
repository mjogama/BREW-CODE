import { BASE_URL } from "../../constants/url/baseURL.js";
import { ORDERS } from "../../constants/endpoints/ordersPath.js";

const accessToken = sessionStorage.getItem("accessToken");

export const retrieveOrdersDataAPI = async () => {
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

export const retrievePaginatedCustomersAPI = async (number) => {
	const res = await fetch(`${BASE_URL.baseURL}${ORDERS.paginated}?number=${number}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!res.ok) {
		return console.error("Couldn't fetch paganated customers.");
	}

	const data = await res.json();

	return data.details.data;
};

export const updateOrderDataAPI = async (id, value) => {
	const res = await fetch(`${BASE_URL.baseURL}${ORDERS.updateOrdersDataPath}/${id}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		method: "PATCH",
		body: JSON.stringify({ status: value }),
	});

	const data = await res.json();

	return data.detials;
};

export const deleteOrderDataAPI = async (orderId) => {
	const res = await fetch(`${BASE_URL.baseURL}${ORDERS.deleteOrderDataPath}/${orderId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		method: "DELETE",
	});

	const data = await res.json();

	return data.details;
};
