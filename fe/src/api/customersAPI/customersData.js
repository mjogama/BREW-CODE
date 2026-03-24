import { BASE_URL } from "../../constants/url/baseURL.js";
import { CUSTOMER } from "../../constants/endpoints/customersPath.js";

const accessToken = sessionStorage.getItem("accessToken");

export const retrieveCustomersAPI = async () => {
	const res = await fetch(`${BASE_URL.baseURL}${CUSTOMER.customers}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!res.ok) {
		return console.error("Couldn't fetch total customers.");
	}

	const data = await res.json();

	return data.details.data;
};

export const deleteCustomerDataAPI = async (customerId) => {
	const res = await fetch(`${BASE_URL.baseURL}${CUSTOMER.customerId}/${customerId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		method: "DELETE",
	});

	if (!res.ok) {
		return console.error("Couldn't delete a customer.");
	}

	const data = await res.json();

	return data.details.message;
};
