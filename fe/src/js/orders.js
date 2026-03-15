import { retrieveOrdersData, deleteOrderData } from "../api/ordersAPI/ordersAPI.js";
import regexHTMLHandler from "../utils/regexHTMLHandler.js";
import formatData from "../utils/formatDate.js";

const retrieveOrdersDataHandler = async () => {
  const ordersTableBody = document.getElementById("ordersTableBody");
  const statusChangeModal = document.getElementById("statusChangeModal");
  const tableCountBodyOrders = document.getElementById("tableCountBodyOrders");
  const sortOrders = document.getElementById("sortOrders");

  const data = await retrieveOrdersData();

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
				<select class="order-status-select toolbar-select" data-name="${regexHTMLHandler(order.user.fullName)}">
					<option value="">${regexHTMLHandler(order.status)}</option>
					<option value="ongoing">Ongoing</option>
					<option value="finished">Finished</option>
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
      const user = button.getAttribute("data-name");
      if (!user) return;

      // Store references BEFORE showing modal
      activeOrderButton = button;
      previousStatus = button.getAttribute("data-prev-status") ?? "";

      statusChangeModal.classList.add("is-modal-overlay-hidden");
    });
  });

  orderDeleteButton.forEach((button) => {
    button?.addEventListener("click", async () => {
      const orderId = button.getAttribute("data-order-id");

      await deleteOrderData(orderId);

      retrieveOrdersDataHandler();
    });
  });

  const statusModalYesHandler = () => {
    statusChangeModal.classList.remove("is-modal-overlay-hidden");

    // Update the prev-status to the new value for next time
    if (activeOrderButton) {
      activeOrderButton.setAttribute("data-prev-status", activeOrderButton.value);
    }

    activeOrderButton = null;
  };

  const statusModalNoHandler = () => {
    statusChangeModal.classList.remove("is-modal-overlay-hidden");

    if (activeOrderButton) {
      // Revert to previous status
      activeOrderButton.value = previousStatus;

      // Optional: reset to default if no previous status
      if (!previousStatus) {
        activeOrderButton.selectedIndex = 0;
      }
    }

    activeOrderButton = null;
  };

  statusModalYesButton?.addEventListener("click", statusModalYesHandler);
  statusModalNoButton?.addEventListener("click", statusModalNoHandler);
};

retrieveOrdersDataHandler();
