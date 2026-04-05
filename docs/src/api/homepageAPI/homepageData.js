import { BASE_URL } from "../../constants/url/baseURL.js";
import { HOMEPAGE } from "../../constants/endpoints/homepagePath.js";

const accessToken = sessionStorage.getItem("accessToken");

export const createNewOrderAPI = async (products, amount) => {
	const res = await fetch(`${BASE_URL.baseURL}${HOMEPAGE.createNewOrder}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		credentials: "include",
		method: "POST",
		body: JSON.stringify({ purchasedProducts: products, totalAmount: amount }),
	});

	if (!res.ok) {
		console.error("Couldn't create new order.");
		return;
	}

	return;
};

export const retrieveUserDataAPI = async () => {
	const res = await fetch(`${BASE_URL.baseURL}${HOMEPAGE.userData}`, {
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

	return data.details?.data?.fullName;
};

export const retrieveMenuAPI = async () => {
	const res = await fetch(`${BASE_URL.baseURL}${HOMEPAGE.retrieveMenu}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		credentials: "include",
	});

	if (!res.ok) {
		console.error("Couldn't fetch menu.");
		return;
	}

	const data = await res.json();

	return data.details?.data;
};
