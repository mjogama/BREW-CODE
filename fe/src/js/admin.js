import {
	retrieveTotalProductsAPI,
	retriveTotalOrdersAPI,
	retrieveTotalCustomersAPI,
	retriveTotalRevenueAPI,
} from "../api/adminAPI/stats.js";
import {
	createNewProductAPI,
	retrieveProductsAPI,
	updateProductAPI,
	deleteProductAPI,
} from "../api/adminAPI/table.js";
import animateCount from "../utils/animateCount.js";
import formatDate from "../utils/formatDate.js";
import regexHTMLHandler from "../utils/regexHTMLHandler.js";

// products statistics elements
const navbarName = document.getElementById("navbarName");
const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRevenueEl = document.getElementById("totalRevenue");

// add product modal elements
const addProductModal = document.getElementById("addProductModal");
const openAddProductModalButton = document.getElementById("openAddProductModal");
const newProductEmoji = document.getElementById("newProductEmoji");
const newProductName = document.getElementById("newProductName");
const newProductDesc = document.getElementById("newProductDesc");
const newProductPrice = document.getElementById("newProductPrice");

// edit modals elements
const editModal = document.getElementById("editProductModal");
const editIdInput = document.getElementById("editProductId");
const editNameInput = document.getElementById("editProductName");

// search product elements
const searchProducts = document.getElementById("searchProducts");
const sortProducts = document.getElementById("sortProducts");

// table products elements
const tableBody = document.getElementById("productsTableBody");
const tableCountBody = document.getElementById("tableCountBody");

export const retrieveAdminData = async () => {
	const accessToken = sessionStorage.getItem("accessToken");

	if (!accessToken) {
		window.location.href = "./login.html";
		return;
	}

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

	const data = await retrieveProductsAPI();

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
		const renderProductRows = (productList) => {
			tableBody.innerHTML = productList
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
		};

		renderProductRows(products);

		searchProducts?.addEventListener("input", () => {
			const keyword = searchProducts.value.toLowerCase();
			const filteredProducts =
				keyword === ""
					? products
					: products.filter((product) => product.name.toLowerCase().includes(keyword));
			renderProductRows(filteredProducts);
			attachRowListeners();
		});

		sortProducts?.addEventListener("change", (e) => {
			if (e.target.value === "name-asc") {
				const sortedProductsAZ = products.sort((a, b) => a.name.localeCompare(b.name));

				renderProductRows(sortedProductsAZ);
			}

			if (e.target.value === "name-desc") {
				const sortedProductsAZ = products.sort((a, b) => b.name.localeCompare(a.name));

				renderProductRows(sortedProductsAZ);
			}
		});

		const attachRowListeners = () => {
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
					await deleteProductAPI(productId);
					retrieveAdminData();
				});
			});
		};

		attachRowListeners();
	}

	tableCountBody.innerHTML = `
		<span class="table-count" id="tableCount">Showing ${totalProducts ?? 0} products</span>
	`;
};

// add product modal: open only on button click
openAddProductModalButton?.addEventListener("click", () => {
	addProductModal?.classList.add("open");
	newProductEmoji.value = "";
	newProductName.value = "";
	newProductDesc.value = "";
	newProductPrice.value = "";
});

const closeAddProductModal = () => {
	addProductModal?.classList.remove("open");
};

document.getElementById("closeAddProductModal")?.addEventListener("click", closeAddProductModal);
document.getElementById("cancelAddProduct")?.addEventListener("click", closeAddProductModal);

document.getElementById("addProductForm")?.addEventListener("submit", async (e) => {
	e.preventDefault();

	if (
		!newProductEmoji.value ||
		!newProductName.value ||
		!newProductDesc.value ||
		!newProductPrice.value
	) {
		const addProductError = document.getElementById("addProductError");

		if (!addProductError) return;
		addProductError.textContent = "All fields are required.";

		setTimeout(() => {
			addProductError.textContent = "";
		}, 2000);
		return;
	}

	await createNewProductAPI({
		emoji: newProductEmoji.value,
		name: newProductName.value,
		desc: newProductDesc.value,
		price: newProductPrice.value,
	});

	closeAddProductModal();
	retrieveAdminData();
});

// Modal for table actions
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
