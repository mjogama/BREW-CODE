import {
	retrieveTotalProductsAPI,
	retriveTotalOrdersAPI,
	retrieveTotalCustomersAPI,
	retriveTotalRevenueAPI,
} from "../api/adminAPI/stats.js";
import animateCount from "../utils/animateCount.js";
import {
	retrieveOrdersDataAPI,
	updateOrderDataAPI,
	deleteOrderDataAPI,
} from "../api/ordersAPI/ordersAPI.js";
import regexHTMLHandler from "../utils/regexHTMLHandler.js";
import formatData from "../utils/formatDate.js";
import { notifyOrdersChanged } from "../utils/orderBroadcast.js";

// stats elements
const navbarName = document.getElementById("navbarName");
const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRevenueEl = document.getElementById("totalRevenue");

const retrieveOrdersDataHandler = async () => {
	const ordersTableBody = document.getElementById("ordersTableBody");
	const statusChangeModal = document.getElementById("statusChangeModal");
	const tableCountBodyOrders = document.getElementById("tableCountBodyOrders");
	const sortOrders = document.getElementById("sortOrders");

	// stats data
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

	const data = await retrieveOrdersDataAPI();

	const orders = data.details.orders || [];
	const user = orders.map((user) => user.fullName);

	sortOrders?.addEventListener("click", () => {
		if (sortOrders.value === "name-asc") {
			// orders.sort((a, b) => a.fullName.localeCompare(b.user.fullName));
			console.log(orders);
			console.log(user);
		} else {
			orders.sort((a, b) => b.user.fullName.localeCompare(a.user.fullName));
		}
	});

	tableCountBodyOrders.innerHTML = `
		<span class="table-count" id="tableCount">Showing ${orders.length ?? 0} products</span>
	`;

	if (orders.length === 0) {
		ordersTableBody.innerHTML = `
			<tr class="table-empty-row">
				<td colspan="6">
					<div class="empty-state">
						<span class="empty-icon">📭</span>
						<p>No products yet. Add your first product above.</p>
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
			<td>
				<div>
					<span class="id-cell" title="${regexHTMLHandler(order._id)}">${regexHTMLHandler(order._id)}</span>
				</div>
			</td>
			<td>
          		<span class="order-customer-name">${regexHTMLHandler(order.user.fullName)}</span>
        	</td>
       		<td>
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
        	<td>
				<select class="order-status-select toolbar-select" data-order-id="${regexHTMLHandler(order._id)}" data-prev-status="${regexHTMLHandler(order.status)}">
					<option value="pending" ${order.status === "pending" ? "selected" : ""}>pending</option>
					<option value="ongoing" ${order.status === "ongoing" ? "selected" : ""}>ongoing</option>
					<option value="finished" ${order.status === "finished" ? "selected" : ""}>finished</option>
				</select>
        	</td>
        	<td>
          		<span>${regexHTMLHandler(formatData(order.createdAt))}</span>
        	</td>
			<td>
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
	}

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

			// // Optional: reset to default if no previous status
			// if (!previousStatus) {
			//   activeOrderButton.selectedIndex = 0;
			// }
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

retrieveOrdersDataHandler();
