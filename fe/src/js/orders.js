import { retrieveOrdersData } from "../api/ordersAPI.js";
import regexHTMLHandler from "../utils/regexHTMLHandler.js";
import formatData from "../utils/formatDate.js";

const ordersTableBody = document.getElementById("ordersTableBody");

const retrieveOrdersDataHandler = async () => {
  const data = await retrieveOrdersData();

  const orders = data.details.orders || [];

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
          <span>${regexHTMLHandler(order.username)}</span>
        </td>
        <td>
          <div>
            ${order.purchasedProducts.map((product) => {
              return `
                <span>${product.productName}</span>
              `;
            })}
          </div>
        </td>
        <td>
          <div>
            ${order.purchasedProducts.map((product) => {
              return `
                <span>${product.quantity}</span>
              `;
            })}
          </div>
        </td>
        <td>
          <span>${regexHTMLHandler(order.status)}</span>
        </td>
        <td>
          <span>${regexHTMLHandler(formatData(order.createdAt))}</span>
        </td>
			</tr>
    `;
    })
    .join("");
  // <td>
  //   <div class="action-btns">
  //     <button
  //       type="button"
  //       class="btn-edit edit-button"
  //       data-product-id="${regexHTMLHandler(product._id)}"
  //       data-product-name="${regexHTMLHandler(product.name)}"
  //       aria-label="Edit">
  //       Edit
  //     </button>
  //     <button
  //       type="button"
  //       class="btn-delete delete-button"
  //       data-product-id="${regexHTMLHandler(product._id)}"
  //       data-product-name="${regexHTMLHandler(product.name)}"
  //       aria-label="Delete">
  //       Delete
  //     </button>
  //   </div>
  // </td>;
};

retrieveOrdersDataHandler();
