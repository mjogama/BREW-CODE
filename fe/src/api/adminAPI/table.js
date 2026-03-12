import { BASE_URL } from "../../constants/url/baseURL.js";
import { PRODUCTS } from "../../constants/endpoints/adminPath.js";

export const createNewProductAPI = async (productData) => {
	const accessToken = sessionStorage.getItem("accessToken");

	const res = await fetch(`${BASE_URL.baseURL}${PRODUCTS.createNewProduct}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		method: "POST",
		body: JSON.stringify(productData),
		credentials: "include",
	});

	if (!res.ok) {
		return console.error("Creating new product error occurred.");
	}

	const data = await res.json();

	return data.details;
};

export const retrieveProductsAPI = async () => {
	const res = await fetch(`${BASE_URL.baseURL}${PRODUCTS.retrieveProducts}`);

	if (!res.ok) {
		return console.error("Couldn't fetch products.");
	}

	return await res.json();
};

export const updateProductAPI = async (productId, value) => {
	const accessToken = sessionStorage.getItem("accessToken");
	const res = await fetch(`${BASE_URL.baseURL}${PRODUCTS.updateProduct}/${productId}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		method: "PATCH",
		body: JSON.stringify({ name: value }),
		credentials: "include",
	});

	const data = await res.json();

	return data.details;
};

export const deleteProductAPI = async (productId) => {
	const accessToken = sessionStorage.getItem("accessToken");
	const res = await fetch(`${BASE_URL.baseURL}${PRODUCTS.deleteProduct}/${productId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		method: "DELETE",
		credentials: "include",
	});

	const data = await res.json();

	return data.details;
};
