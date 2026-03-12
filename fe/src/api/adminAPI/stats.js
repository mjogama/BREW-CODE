import { BASE_URL } from "../../constants/url/baseURL.js";
import { PRODUCTS } from "../../constants/endpoints/adminPath.js";

const accessToken = sessionStorage.getItem("accessToken");

export const retrieveTotalProductsAPI = async () => {
	const res = await fetch(`${BASE_URL.baseURL}${PRODUCTS.retrieveTotalProducts}`);

	if (!res.ok) {
		return console.error("Couldn't fetch products.");
	}

	const data = await res.json();

	return data.details.totalProducts;
};

export const retriveTotalOrdersAPI = async () => {
	const res = await fetch(`${BASE_URL.baseURL}${PRODUCTS.totalOrders}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!res.ok) {
		return console.error("Couldn't fetch total orders.");
	}

	const data = await res.json();

	return data.details.totalOrders;
};

export const retrieveTotalCustomersAPI = async () => {
	const res = await fetch(`${BASE_URL.baseURL}${PRODUCTS.admin}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		credentials: "include",
	});

	if (!res.ok) {
		window.location.href = "./login.html";
		return;
	}

	const data = await res.json();

	return data.details;
};

export const retriveTotalRevenueAPI = async () => {
	const res = await fetch(`${BASE_URL.baseURL}${PRODUCTS.totalRevenue}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!res.ok) {
		return console.error("Couldn't fetch total customers.");
	}

	const data = await res.json();

	return data.details.revenue;
};
