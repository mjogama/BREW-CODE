import formatPrice from "../../utils/formatPrice.js";
import regexHTMLHandler from "../../utils/regexHTMLHandler.js";

const renderMenus = (products) => {
	if (!Array.isArray(products) || products.length === 0) {
		menuBody.innerHTML = "";
		return;
	}

	const items = products.map((product) => {
		return {
			emoji: product.emoji ?? "",
			name: product.name ?? "",
			desc: product.desc ?? "",
			priceDisplay: formatPrice(product.price),
			priceForCart: (Number(product.price) || 0).toFixed(2),
		};
	});

	menuBody.innerHTML = items
		.map(
			(p) => `
				<div class="menu-card">
					<div class="menu-card-emoji">${regexHTMLHandler(p.emoji)}</div>
					<div class="menu-card-body">
						<h3>${regexHTMLHandler(p.name)}</h3>
						<p class="menu-card-desc">${regexHTMLHandler(p.desc)}</p>
						<div class="menu-card-footer">
							<span class="price">${regexHTMLHandler(p.priceDisplay)}</span>
							<button class="add-to-cart-btn" data-product="${regexHTMLHandler(p.name)}" data-price="${regexHTMLHandler(p.priceForCart)}">Add to Cart</button>
						</div>
					</div>
				</div>
			`,
		)
		.join("");
};

export default renderMenus;
