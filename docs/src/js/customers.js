import { retrieveTotalProductsAPI, retriveTotalOrdersAPI, retrieveTotalCustomersAPI, retriveTotalRevenueAPI } from "../api/adminAPI/stats.js";
import { retrievePaginatedCustomersAPI, deleteCustomerDataAPI } from "../api/customersAPI/customersData.js";
import animateCount from "../utils/animateCount.js";
import formatDate from "../utils/formatDate.js";
import { initAdminLayout } from "./adminLayout.js";
import regexHTMLHandler from "../utils/regexHTMLHandler.js";

// stats elements
const navbarName = document.getElementById("navbarName");
const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRevenueEl = document.getElementById("totalRevenue");

// skeleton elements
const statsSkeleton = document.getElementById("statsSkeleton");
const customersTableSkeleton = document.getElementById("customersTableSkeleton");
const statsStrip = document.getElementById("statsStrip");
const customersTableWrapper = document.getElementById("customersTableWrapper");
const customersTableFooter = document.getElementById("customersTableFooter");

const searchCustomers = document.getElementById("searchCustomers");
const sortCustomersName = document.getElementById("sortCustomersName");
const customersTableBody = document.getElementById("customersTableBody");
const tableCountBodyOrders = document.getElementById("tableCountBodyOrders");

let pageNumber = 1;

const retrieveStatsData = async () => {
  // Show skeletons before fetching
  statsSkeleton?.classList.remove("skeleton-hidden");
  customersTableSkeleton?.classList.add("visible");
  statsStrip?.classList.add("skeleton-hidden");
  customersTableWrapper?.classList.add("skeleton-hidden");
  customersTableFooter?.classList.add("skeleton-hidden");

  const totalProducts = await retrieveTotalProductsAPI();
  const totalOrders = await retriveTotalOrdersAPI();
  const totalCustomers = await retrieveTotalCustomersAPI();
  const totalRevenue = await retriveTotalRevenueAPI();

  navbarName.textContent = totalCustomers.data.fullName;

  // Hide skeletons after data is loaded
  statsSkeleton?.classList.add("skeleton-hidden");
  customersTableSkeleton?.classList.remove("visible");
  statsStrip?.classList.remove("skeleton-hidden");
  customersTableWrapper?.classList.remove("skeleton-hidden");
  customersTableFooter?.classList.remove("skeleton-hidden");

  // Use totalProducts from API (same origin, no dependency on visiting homepage)
  animateCount(totalProductsEl, totalProducts ?? 0);
  animateCount(totalOrdersEl, totalOrders ?? 0);
  animateCount(totalCustomersEl, totalCustomers.totalCustomers ?? 0);
  animateCount(totalRevenueEl, totalRevenue ?? 0);
};

const retrieveCustomersDataHandler = async () => {
  const totalCustomers = await retrieveTotalCustomersAPI();

  // Update pagination button states
  updatePaginationButtons(totalCustomers.totalCustomers ?? 0);

  const paginatedCustomers = await retrievePaginatedCustomersAPI(pageNumber);

  const customers = paginatedCustomers || [];

  if (customers.length === 0) {
    // Empty page: only step back when we are past page 1 (e.g. overshoot or last row deleted).
    // On page 1 with zero total customers, keep pageNumber at 1 — do not go to 0 or negative.
    if (pageNumber > 1) {
      pageNumber--;
      await retrieveCustomersDataHandler();
      return;
    }
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
			<td data-label="ID">
				<div>
					<span class="id-cell" title="${regexHTMLHandler(customer._id)}">${regexHTMLHandler(customer._id)}</span>
				</div>
			</td>
			<td data-label="Customer">
          		<span class="order-customer-name" title="${regexHTMLHandler(customer.fullName)}">${regexHTMLHandler(customer.fullName)}</span>
        	</td>
            <td data-label="Email">
          		<span class="order-customer-name" title="${regexHTMLHandler(customer.email)}">${regexHTMLHandler(customer.email)}</span>
        	</td>
        	<td data-label="Joined">
          		<span>${regexHTMLHandler(formatDate(customer.createdAt))}</span>
        	</td>
			<td data-label="Actions">
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
        const customerNameAZ = customers.sort((a, b) => a.fullName.localeCompare(b.fullName));
        renderCustomersTable(customerNameAZ);
      } else {
        const customerNameZA = customers.sort((a, b) => b.fullName.localeCompare(a.fullName));
        renderCustomersTable(customerNameZA);
      }
    });

    customersTableBody.querySelectorAll(".delete-button").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const userId = btn.getAttribute("data-customer-id");
        await deleteCustomerDataAPI(userId);
        await retrieveStatsData();
        await retrieveCustomersDataHandler();
      });
    });
  }

  tableCountBodyOrders.innerHTML = `
		<span class="table-count" id="tableCount">Page No. ${pageNumber} of customers</span>
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
    await retrieveCustomersDataHandler();
  });
});

retrieveStatsData();
retrieveCustomersDataHandler();
initAdminLayout();
