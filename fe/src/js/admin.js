import { retrieveProductAPI, retrieveTotalProductsAPI, updateProductAPI, deleteProductAPI } from "../api/adminAPI.js";
import formatDate from "../utils/formatDate.js";
import regexHTMLHandler from "../utils/regexHTMLHandler.js";

// add product elements
const openAddProductModalButton = document.getElementById("openAddProductModal");

// products statistics elements
const navbarName = document.getElementById("navbarName");
const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRevenueEl = document.getElementById("totalRevenue");

// edit modals elements
const editModal = document.getElementById("editProductModal");
const editIdInput = document.getElementById("editProductId");
const editNameInput = document.getElementById("editProductName");

// table products elements
const tableBody = document.getElementById("productsTableBody");
const tableCountBody = document.getElementById("tableCountBody");

const baseURL = "http://localhost:8000/api";
const pathAdmin = "/user/admin";
const pathTotalOrders = "/order/totalOrders";
const pathTotalRevenue = "/order/revenue";

const animateCount = (element, target, durationMs = 1200) => {
	let start = 0;
	const startTime = performance.now();

	function update(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / durationMs, 1);

		// Ease-out: fast at start, slow at end
		const eased = 1 - (1 - progress) ** 2;
		const value = Math.round(start + (target - start) * eased);
		element.textContent = value;

		if (progress < 1) {
			requestAnimationFrame(update);
		} else {
			element.textContent = target;
		}
	}

	element.textContent = start;
	requestAnimationFrame(update);
};

const retrieveAdminData = async () => {
	const accessToken = sessionStorage.getItem("accessToken");

	if (!accessToken) {
		window.location.href = "./login.html";
		return;
	}

	const productQuantity = await retrieveTotalProductsAPI();

	const responseAdmin = await fetch(`${baseURL}${pathAdmin}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
		credentials: "include",
	});

	const responseTotalOrders = await fetch(`${baseURL}${pathTotalOrders}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	const repsonseTotalRevenue = await fetch(`${baseURL}${pathTotalRevenue}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!responseAdmin.ok) {
		// const error = await responseAdmin.json();
		// console.error(error.details.errorMessage);
		window.location.href = "./login.html";
		return;
	}

	const dataAdmin = await responseAdmin.json();
	const dataTotalOrders = await responseTotalOrders.json();
	const dataTotalRevenue = await repsonseTotalRevenue.json();

	navbarName.textContent = dataAdmin.details.data.fullName;

	// Use totalProducts from API (same origin, no dependency on visiting homepage)
	animateCount(totalProductsEl, productQuantity ?? 0);
	animateCount(totalOrdersEl, dataTotalOrders.details.totalOrders ?? 0);
	animateCount(totalCustomersEl, dataAdmin.details.totalCustomers ?? 0);
	animateCount(totalRevenueEl, dataTotalRevenue.details.revenue ?? 0);

	const data = await retrieveProductAPI();

	const products = data.details.data || [];
	if (products.length === 0) {
		tableBody.innerHTML = `
			<tr class="table-empty-row">
				<td colspan="4">
					<div class="empty-state">
						<span class="empty-icon">📭</span>
						<p>No products yet. Add your first product above.</p>
					</div>
				</td>
			</tr>
		`;
	} else {
		tableBody.innerHTML = products
			.map((product) => {
				return `
			<tr class="product-row">
				<td>
					<div>
						<span class="id-cell" title="${regexHTMLHandler(product._id)}">${regexHTMLHandler(product._id)}</span>
					</div>
				</td>
				<td>
					<span class="product-name" data-product-id="${regexHTMLHandler(product._id)}">${regexHTMLHandler(product.name)}</span>
				</td>
				<td>
					<div class="product-date">${regexHTMLHandler(formatDate(product.createdAt))}</div>
				</td>
				<td>
					<div class="action-btns">
						<button type="button" class="btn-edit edit-button" data-product-id="${regexHTMLHandler(product._id)}" data-product-name="${regexHTMLHandler(product.name)}" aria-label="Edit">Edit</button>
						<button type="button" class="btn-delete delete-button" data-product-id="${regexHTMLHandler(product._id)}" data-product-name="${regexHTMLHandler(product.name)}" aria-label="Delete">Delete</button>
					</div>
				</td>
			</tr>
		`;
			})
			.join("");

		tableBody.querySelectorAll(".edit-button").forEach((btn) => {
			btn.addEventListener("click", async () => {
				const productId = btn.getAttribute("data-product-id");
				const productName = btn.getAttribute("data-product-name");

				if (editModal && editIdInput && editNameInput) {
					editIdInput.value = productId;
					editNameInput.value = productName || "";
					document.getElementById("editProductError").textContent = "";
					editModal.classList.add("open");
				}
			});
		});

		tableBody.querySelectorAll(".delete-button").forEach((btn) => {
			btn.addEventListener("click", async () => {
				const productId = btn.getAttribute("data-product-id");
				await deleteProductAPI(productId, accessToken);
				retrieveAdminData();
			});
		});
	}

	tableCountBody.innerHTML = `
		<span class="table-count" id="tableCount">Showing ${productQuantity ?? 0} products</span>
	`;
};

const closeEditModal = () => editModal?.classList.remove("open");

document.getElementById("closeEditProductModal")?.addEventListener("click", closeEditModal);
document.getElementById("cancelEditProduct")?.addEventListener("click", closeEditModal);

document.getElementById("editProductForm")?.addEventListener("submit", async (e) => {
	e.preventDefault();
	const data = await updateProductAPI(editIdInput.value, editNameInput.value);
	closeEditModal();
	if (data) retrieveAdminData();
});

retrieveAdminData();
