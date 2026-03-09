const baseURL = "http://localhost:8000/api";
const retrieveProducts = "/product";
const retrieveTotalProducts = "/product/total-products";
const updateProduct = "/product/edit";
const deleteProduct = "/product/delete";

export const retrieveTotalProductsAPI = async () => {
	const res = await fetch(`${baseURL}${retrieveTotalProducts}`);

	if (!res.ok) {
		return console.error("Couldn't fetch products.");
	}

	const data = await res.json();

	return data.details.totalProducts;
};

export const retrieveProductAPI = async () => {
	const res = await fetch(`${baseURL}${retrieveProducts}`);

	if (!res.ok) {
		return console.error("Couldn't fetch products.");
	}

	return await res.json();
};

export const updateProductAPI = async (productId, value) => {
	const accessToken = sessionStorage.getItem("accessToken");
	const res = await fetch(`${baseURL}${updateProduct}/${productId}`, {
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
	const res = await fetch(`${baseURL}${deleteProduct}/${productId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		method: "DELETE",
		credentials: "include",
	});

	const data = await res.json();

	return data.details;
};
