import {
	retrieveTotalProductsAPI,
	retriveTotalOrdersAPI,
	retrieveTotalCustomersAPI,
	retriveTotalRevenueAPI,
} from "../api/adminAPI/stats.js";
import { retrieveCustomersAPI, deleteCustomerDataAPI } from "../api/customersAPI/customersData.js";
import animateCount from "../utils/animateCount.js";
import formatDate from "../utils/formatDate.js";
import regexHTMLHandler from "../utils/regexHTMLHandler.js";

// stats elements
const navbarName = document.getElementById("navbarName");
const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRevenueEl = document.getElementById("totalRevenue");

const searchCustomers = document.getElementById("searchCustomers");
const sortCustomersName = document.getElementById("sortCustomersName");
const customersTableBody = document.getElementById("customersTableBody");

const retrieveCustomersDataHandler = async () => {
	const totalProducts = await retrieveTotalProductsAPI();
	const totalOrders = await retriveTotalOrdersAPI();
	const totalCustomers = await retrieveTotalCustomersAPI();
	const totalRevenue = await retriveTotalRevenueAPI();
	const customersResult = await retrieveCustomersAPI();

	navbarName.textContent = totalCustomers.data.fullName;

	// Use totalProducts from API (same origin, no dependency on visiting homepage)
	animateCount(totalProductsEl, totalProducts ?? 0);
	animateCount(totalOrdersEl, totalOrders ?? 0);
	animateCount(totalCustomersEl, totalCustomers.totalCustomers ?? 0);
	animateCount(totalRevenueEl, totalRevenue ?? 0);

	const customers = customersResult || [];

	if (customers.length === 0) {
		customersTableBody.innerHTML = `
			<tr class="table-empty-row">
				<td colspan="5">
					<div class="empty-state">
						<span class="empty-icon">📭</span>
						<p>No customers yet.</p>
					</div>
				</td>
			</tr>
		`;
	} else {
		const renderCustomersTable = (customers) => {
			customersTableBody.innerHTML = customers
				.map((customer) => {
					return `
     	<tr class="product-row">
			<td>
				<div>
					<span class="id-cell" title="${regexHTMLHandler(customer._id)}">${regexHTMLHandler(customer._id)}</span>
				</div>
			</td>
			<td>
          		<span class="order-customer-name">${regexHTMLHandler(customer.fullName)}</span>
        	</td>
            <td>
          		<span class="order-customer-name">${regexHTMLHandler(customer.email)}</span>
        	</td>
        	<td>
          		<span>${regexHTMLHandler(formatDate(customer.createdAt))}</span>
        	</td>
			<td>
				<button
		       		type="button"
		       		class="btn-delete delete-button"
		       		data-customer-id="${regexHTMLHandler(customer._id)}"
		       		data-customer-name="${regexHTMLHandler(customer.fullName)}"
		       		aria-label="Delete">
		       		Delete
	    		</button>
			</td>
		</tr>
    `;
				})
				.join("");
		};

		searchCustomers?.addEventListener("input", () => {
			const customerName = searchCustomers.value.toLowerCase();
			const filteredCustomerName =
				customerName === ""
					? customers
					: customers.filter((name) => {
							return name.fullName.toLowerCase().includes(customerName);
						});
			renderCustomersTable(filteredCustomerName);
		});

		renderCustomersTable(customers);

		sortCustomersName?.addEventListener("change", (e) => {
			e.preventDefault();

			if (sortCustomersName.value === "name-asc") {
				const customerNameAZ = customers.sort((a, b) =>
					a.fullName.localeCompare(b.fullName.localeCompare),
				);
				renderCustomersTable(customerNameAZ);
			} else {
				const customerNameZA = customers.sort((a, b) =>
					b.fullName.localeCompare(a.fullName.localeCompare),
				);
				renderCustomersTable(customerNameZA);
			}
		});

		customersTableBody.querySelectorAll(".delete-button").forEach((btn) => {
			btn.addEventListener("click", async () => {
				const userId = btn.getAttribute("data-customer-id");
				await deleteCustomerDataAPI(userId);
				retrieveCustomersDataHandler();
			});
		});
	}

	tableCountBodyOrders.innerHTML = `
		<span class="table-count" id="tableCount">Showing ${customers.length ?? 0} products</span>
	`;
};

retrieveCustomersDataHandler();
