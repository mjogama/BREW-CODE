import { retrieveTotalProductsAPI, retriveTotalOrdersAPI, retrieveTotalCustomersAPI, retriveTotalRevenueAPI } from "../api/adminAPI/stats.js";
import { createNewProductAPI, retrievePaginatedProductsAPI, updateProductAPI, deleteProductAPI } from "../api/adminAPI/table.js";
import animateCount from "../utils/animateCount.js";
import formatDate from "../utils/formatDate.js";
import regexHTMLHandler from "../utils/regexHTMLHandler.js";
import { initAdminLayout } from "./adminLayout.js";
import { hideSkeleton } from "../utils/skeletonLoader.js";

// products statistics elements
const navbarName = document.getElementById("navbarName");
const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRevenueEl = document.getElementById("totalRevenue");

// skeleton elements
const statsSkeleton = document.getElementById("statsSkeleton");
const productsTableSkeleton = document.getElementById("productsTableSkeleton");
const statsStrip = document.getElementById("statsStrip");
const productsTableWrapper = document.getElementById("productsTableWrapper");
const productsTableFooter = document.getElementById("productsTableFooter");

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
const tableCountBodyProducts = document.getElementById("tableCountBodyProducts");

let pageNumber = 1;

const retrieveStatsData = async () => {
  // Show skeletons before fetching
  statsSkeleton?.classList.remove("skeleton-hidden");
  productsTableSkeleton?.classList.add("visible");
  statsStrip?.classList.add("skeleton-hidden");
  productsTableWrapper?.classList.add("skeleton-hidden");
  productsTableFooter?.classList.add("skeleton-hidden");

  const totalProducts = await retrieveTotalProductsAPI();
  const totalOrders = await retriveTotalOrdersAPI();
  const totalCustomers = await retrieveTotalCustomersAPI();
  const totalRevenue = await retriveTotalRevenueAPI();

  // Hide skeletons after data is loaded
  statsSkeleton?.classList.add("skeleton-hidden");
  productsTableSkeleton?.classList.remove("visible");
  statsStrip?.classList.remove("skeleton-hidden");
  productsTableWrapper?.classList.remove("skeleton-hidden");
  productsTableFooter?.classList.remove("skeleton-hidden");

  navbarName.textContent = totalCustomers.data.fullName;

  // Use totalProducts from API (same origin, no dependency on visiting homepage)
  animateCount(totalProductsEl, totalProducts ?? 0);
  animateCount(totalOrdersEl, totalOrders ?? 0);
  animateCount(totalCustomersEl, totalCustomers.totalCustomers ?? 0);
  animateCount(totalRevenueEl, totalRevenue ?? 0);
};

export const retrieveAdminData = async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    window.location.href = "./login.html";
    return;
  }
  const totalProducts = await retrieveTotalProductsAPI();

  // Update pagination button states
  updatePaginationButtons(totalProducts);

  const paginatedProducts = await retrievePaginatedProductsAPI(pageNumber);

  const products = paginatedProducts || [];

  if (products.length === 0) {
    if (pageNumber > 1) {
      pageNumber--;
      await retrieveAdminData();
      return;
    }

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
				<td data-label="ID">
					<div>
						<span class="id-cell" title="${regexHTMLHandler(product._id)}">${regexHTMLHandler(product._id)}</span>
					</div>
				</td>
				<td data-label="Product">
					<span class="product-name" data-product-id="${regexHTMLHandler(product._id)}" title="${regexHTMLHandler(product.name)}">${regexHTMLHandler(product.name)}</span>
				</td>
				<td data-label="Added">
					<div class="product-date">${regexHTMLHandler(formatDate(product.createdAt))}</div>
				</td>
				<td data-label="Actions">
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
      const filteredProducts = keyword === "" ? products : products.filter((product) => product.name.toLowerCase().includes(keyword));
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

  tableCountBodyProducts.innerHTML = `
		<span class="table-count" id="tableCount">Page No. ${pageNumber} of products</span>
	`;
};

/** Update pagination button disabled states based on current page and total */
const updatePaginationButtons = (total) => {
  const ITEMS_PER_PAGE = 8;
  const maxPage = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const buttons = document.querySelectorAll(".footer-button");

  buttons.forEach((btn) => {
    const direction = Number(btn.getAttribute("data-number"));
    if (direction === -1) {
      btn.disabled = pageNumber <= 1;
    } else {
      btn.disabled = pageNumber >= maxPage;
    }
  });
};

const tableFooterButtons = document.querySelectorAll(".footer-button");

tableFooterButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const data = btn.getAttribute("data-number");
    const direction = Number(data);

    // Prevent navigation beyond bounds
    if (direction === -1 && pageNumber <= 1) return;

    pageNumber += direction;
    await retrieveAdminData();
  });
});

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

  if (!newProductEmoji.value || !newProductName.value || !newProductDesc.value || !newProductPrice.value) {
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

initAdminLayout();
retrieveAdminData();
retrieveStatsData();
