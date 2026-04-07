import { retrieveTotalProductsAPI, retriveTotalOrdersAPI, retrieveTotalCustomersAPI, retriveTotalRevenueAPI } from "../api/adminAPI/stats.js";
import animateCount from "../utils/animateCount.js";
import { retrieveOrdersDataAPI, retrievePaginatedCustomersAPI, updateOrderDataAPI, deleteOrderDataAPI } from "../api/ordersAPI/ordersAPI.js";
import regexHTMLHandler from "../utils/regexHTMLHandler.js";
import formatData from "../utils/formatDate.js";
import { notifyOrdersChanged } from "../utils/orderBroadcast.js";
import { initAdminLayout } from "./adminLayout.js";

// stats elements
const navbarName = document.getElementById("navbarName");
const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRevenueEl = document.getElementById("totalRevenue");

const ordersTableBody = document.getElementById("ordersTableBody");
const statusChangeModal = document.getElementById("statusChangeModal");
const tableCountBodyOrders = document.getElementById("tableCountBodyOrders");
const searchOrders = document.getElementById("searchOrders");
const sortOrders = document.getElementById("sortOrders");

let pageNumber = 1;
let isMaximumPage = pageNumber - 1;

const retrieveStatsData = async () => {
	const totalProducts = await retrieveTotalProductsAPI();
	const totalOrders = await retriveTotalOrdersAPI();
	const totalCustomers = await retrieveTotalCustomersAPI();
	const totalRevenue = await retriveTotalRevenueAPI();

	navbarName.textContent = totalCustomers.data.fullName;

	// Use totalProducts from API (same origin, no dependency on visiting homepage)
	animateCount(totalProductsEl, totalProducts ?? 0);
	animateCount(totalOrdersEl, totalOrders ?? 0);
	animateCount(totalCustomersEl, totalCustomers.totalCustomers ?? 0);
	animateCount(totalRevenueEl, totalRevenue ?? 0);
};

const retrieveOrdersDataHandler = async () => {
	const paginatedOrders = await retrievePaginatedCustomersAPI(pageNumber);

	const orders = paginatedOrders || [];

	if (orders.length === 0) {
		if (pageNumber > 1) {
			pageNumber--;
			await retrieveOrdersDataHandler();
			return;
		}
		ordersTableBody.innerHTML = `
			<tr class="table-empty-row">
				<td colspan="6">
					<div class="empty-state">
						<span class="empty-icon">📭</span>
						<p>No Orders yet.</p>
					</div>
				</td>
			</tr>
		`;
	} else {
		const renderOrdersTable = (orders) => {
			ordersTableBody.innerHTML = orders
				.map((order) => {
					return `
     	<tr class="product-row">
			<td data-label="Order ID">
				<div>
					<span class="id-cell" title="${regexHTMLHandler(order._id)}">${regexHTMLHandler(order._id)}</span>
				</div>
			</td>
			<td data-label="Customer">
          		<span class="order-customer-name">${regexHTMLHandler(order.user.fullName || order.fullName)}</span>
        	</td>
       		<td data-label="Products">
          		<div class="order-products-cell">
					${(() => {
						const products = order.purchasedProducts || [];
						if (!products.length) {
							return `<span>-</span>`;
						}

						const totalQuantity = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
						const hasMore = products.length > 1;

						if (!hasMore) {
							const product = products[0];
							return `
								<div class="order-product-row">
									<span class="order-product-name">${regexHTMLHandler(product.productName)}</span>
									<span class="order-product-qty">${product.quantity}</span>
								</div>
							`;
						}

						const listHtml = `<div class="order-products-list" data-hidden="true">
								${products
									.map(
										(product) => `
									<div class="order-product-row">
										<span class="order-product-name">${regexHTMLHandler(product.productName)}</span>
										<span class="order-product-qty">${product.quantity}</span>
									</div>
								`,
									)
									.join("")}
							</div>`;

						return `
							<div class="order-products-summary">
								<button type="button" class="order-products-toggle-btn" aria-label="Toggle purchased products">Show products</button>
								<span class="order-products-total-qty">${totalQuantity}</span>
							</div>
							${listHtml}
						`;
					})()}
          		</div>
       		</td>
        	<td data-label="Status">
				<select class="order-status-select toolbar-select" data-order-id="${regexHTMLHandler(order._id)}" data-prev-status="${regexHTMLHandler(order.status)}">
					<option value="pending" ${order.status === "pending" ? "selected" : ""}>pending</option>
					<option value="ongoing" ${order.status === "ongoing" ? "selected" : ""}>ongoing</option>
					<option value="finished" ${order.status === "finished" ? "selected" : ""}>finished</option>
				</select>
        	</td>
        	<td data-label="Date">
          		<span>${regexHTMLHandler(formatData(order.createdAt))}</span>
        	</td>
			<td data-label="Actions">
				<button
		       		type="button"
		       		class="btn-delete delete-button"
		       		data-order-id="${regexHTMLHandler(order._id)}"
		       		data-order-name="${regexHTMLHandler(order.user.fullName)}"
		       		aria-label="Delete">
		       		Delete
	    		</button>
			</td>
		</tr>
    `;
				})
				.join("");
		};
		renderOrdersTable(orders);

		searchOrders?.addEventListener("input", () => {
			const customerName = searchOrders.value.toLowerCase();
			const filteredCustomerName =
				customerName === ""
					? orders
					: orders.filter((name) => {
							return name.user.fullName.toLowerCase().includes(customerName);
						});
			renderOrdersTable(filteredCustomerName);
		});

		sortOrders?.addEventListener("click", () => {
			if (sortOrders.value === "name-asc") {
				const ordersCustomerNameAZ = orders.sort((a, b) => a.user.fullName.localeCompare(b.user.fullName));
				renderOrdersTable(ordersCustomerNameAZ);
			} else {
				const ordersCustomerNameZA = orders.sort((a, b) => b.user.fullName.localeCompare(a.user.fullName));
				renderOrdersTable(ordersCustomerNameZA);
			}
		});
	}

	tableCountBodyOrders.innerHTML = `
		<span class="table-count" id="tableCount">Page No. ${pageNumber} of orders</span>
	`;

	const toggleButtons = document.querySelectorAll(".order-products-toggle-btn");
	const orderStatusSelects = document.querySelectorAll(".order-status-select");
	const orderDeleteButton = document.querySelectorAll(".btn-delete");

	const statusModalYesButton = document.getElementById("statusModalYes");
	const statusModalNoButton = document.getElementById("statusModalNo");

	let activeOrderButton = null;
	let previousStatus = "";

	toggleButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const row = button.closest("tr");
			if (!row) return;

			const list = row.querySelector(".order-products-list");
			if (!list) return;

			const isHidden = list.hasAttribute("data-hidden");

			if (isHidden) {
				list.removeAttribute("data-hidden");
				button.classList.add("is-open");
				button.textContent = "Hide products";
			} else {
				list.setAttribute("data-hidden", "true");
				button.classList.remove("is-open");
				button.textContent = "Show products";
			}
		});
	});

	orderStatusSelects.forEach((button) => {
		button.addEventListener("change", () => {
			const userId = button.getAttribute("data-order-id");
			if (!userId) return;

			// Store references BEFORE showing modal
			activeOrderButton = button;
			previousStatus = button.getAttribute("data-prev-status") ?? "";

			statusChangeModal.classList.add("is-modal-overlay-hidden");
		});
	});

	const statusModalYesHandler = async () => {
		statusChangeModal.classList.remove("is-modal-overlay-hidden");

		// Update the prev-status to the new value for next time
		if (activeOrderButton) {
			const userId = activeOrderButton.getAttribute("data-order-id");
			const ok = await updateOrderDataAPI(userId, activeOrderButton.value);
			if (ok) notifyOrdersChanged();
		}

		activeOrderButton = null;
	};

	const statusModalNoHandler = () => {
		statusChangeModal.classList.remove("is-modal-overlay-hidden");

		if (activeOrderButton) {
			// Revert to previous status
			activeOrderButton.value = previousStatus;
		}

		activeOrderButton = null;
	};

	orderDeleteButton.forEach((button) => {
		button?.addEventListener("click", async () => {
			const orderId = button.getAttribute("data-order-id");

			const ok = await deleteOrderDataAPI(orderId);
			if (ok) notifyOrdersChanged();

			retrieveOrdersDataHandler();
		});
	});

	statusModalYesButton?.addEventListener("click", statusModalYesHandler);
	statusModalNoButton?.addEventListener("click", statusModalNoHandler);
};

const tableFooterButtons = document.querySelectorAll(".footer-button");

tableFooterButtons.forEach((btn) => {
	btn.addEventListener("click", async () => {
		const data = btn.getAttribute("data-number");
		pageNumber += Number(data);

		if (pageNumber === 0) {
			pageNumber++;
			Math.ceil((isMaximumPage -= 1.5));
		}

		await retrieveOrdersDataHandler();
	});
});

await retrieveStatsData();
await retrieveOrdersDataHandler();
initAdminLayout();
