const productQuantity = document.querySelectorAll(".menu-card");
const navUsername = document.getElementById("navUsername");
const cartCountBadge = document.getElementById("cartCount");
const navCartButton = document.getElementById("navCartButton");

const navCartSidebarContainer = document.getElementById("navCartSidebarContainer");
const navCartSidebarButton = document.getElementById("navCartSidebarButton");
const navCartSidebarReset = document.getElementById("navCartSidebarReset");
const navCartSidebarPlaceOrder = document.getElementById("navCartSidebarPlaceOrder");
const navCartSidebarItems = document.getElementById("navCartSidebarItems");

const displayOrderTotalAmount = document.getElementById("displayOrderTotalAmount");

const menuBody = document.getElementById("menuBody");

const baseURL = "http://localhost:8000/api";
const createNewOrderPath = "/order/new";
const retrieveUserInfoPath = "/user";
const retrieveMenuPath = "/product";

// Cart state: each item is { productName, price, quantity }
let cart = [];
let totalAmount = 0;

const formatPrice = (value) => {
	const num = Number(value);
	return Number.isNaN(num) ? "₱0.00" : `₱${num.toFixed(2)}`;
};

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
					<div class="menu-card-emoji">${p.emoji}</div>
					<div class="menu-card-body">
						<h3>${p.name}</h3>
						<p class="menu-card-desc">${p.desc}</p>
						<div class="menu-card-footer">
							<span class="price">${p.priceDisplay}</span>
							<button class="add-to-cart-btn" data-product="${p.name.replace(/"/g, "&quot;")}" data-price="${p.priceForCart}">Add to Cart</button>
						</div>
					</div>
				</div>
			`,
		)
		.join("");
};

const retrieveHomepageData = async () => {
	const accessToken = sessionStorage.getItem("accessToken");

	if (!accessToken) {
		window.location.href = "./login.html";
		return;
	}

	const resUser = await fetch(`${baseURL}${retrieveUserInfoPath}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
		credentials: "include",
	});

	const resMenu = await fetch(`${baseURL}${retrieveMenuPath}`);

	if (!resUser.ok) {
		window.location.href = "./login.html";
		return;
	}

	const userData = await resUser.json();

	const menuData = await resMenu.json();

	renderMenus(menuData.details.data);

	sessionStorage.setItem("username", userData.details?.data?.fullName);

	if (navUsername && userData.details?.data?.fullName) {
		navUsername.textContent = userData.details.data.fullName;
	}
};

const createNewOrder = async (username, purchasedProducts) => {
	const accessToken = sessionStorage.getItem("accessToken");

	if (!accessToken) {
		window.location.href = "./login.html";
		return;
	}

	const response = await fetch(`${baseURL}${createNewOrderPath}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		credentials: "include",
		method: "POST",
		body: JSON.stringify({ username, purchasedProducts, totalAmount }),
	});

	if (!response.ok) {
		console.error("Something went wrong.");
		return;
	}

	const data = await response.json();

	displayOrderTotalAmount.textContent = `₱${(0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getCartTotalCount = () => {
	return cart.reduce((sum, item) => sum + item.quantity, 0);
};

const updateOrderTotalDisplay = () => {
	if (!displayOrderTotalAmount) return;
	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	totalAmount = total;
	displayOrderTotalAmount.textContent = `₱${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const renderCartSidebar = () => {
	if (!navCartSidebarItems) return;

	// placeOrderButton();
	updateOrderTotalDisplay();

	if (cart.length === 0) {
		navCartSidebarItems.innerHTML = '<p class="nav-cart-sidebar-empty">Your cart is empty.</p>';
		return;
	}

	navCartSidebarItems.innerHTML = cart
		.map(
			(item) => `
		<div class="nav-cart-sidebar-item" data-product="${item.productName.replace(/"/g, "&quot;")}">
			<div class="nav-cart-sidebar-item-info">
				<span class="nav-cart-sidebar-item-name">${item.productName}</span>
				<span class="nav-cart-sidebar-item-price">₱${item.price.toFixed(2)} × ${item.quantity}</span>
			</div>
			<div class="nav-cart-sidebar-item-actions">
				<button type="button" class="nav-cart-sidebar-qty-btn" data-product="${item.productName.replace(/"/g, "&quot;")}" data-delta="-1">−</button>
				<span class="nav-cart-sidebar-qty">${item.quantity}</span>
				<button type="button" class="nav-cart-sidebar-qty-btn" data-product="${item.productName.replace(/"/g, "&quot;")}" data-delta="1">+</button>
				<button type="button" class="nav-cart-sidebar-remove" data-product="${item.productName.replace(/"/g, "&quot;")}" aria-label="Remove">×</button>
			</div>
		</div>
	`,
		)
		.join("");

	// Delegate events for quantity and remove
	navCartSidebarItems.querySelectorAll(".nav-cart-sidebar-qty-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			const name = btn.getAttribute("data-product");
			const delta = parseInt(btn.getAttribute("data-delta"), 10);
			updateQuantity(name, delta);
		});
	});

	navCartSidebarItems.querySelectorAll(".nav-cart-sidebar-remove").forEach((btn) => {
		btn.addEventListener("click", () => removeFromCart(btn.getAttribute("data-product")));
	});
};

const updateCartBadge = () => {
	if (cartCountBadge) cartCountBadge.textContent = getCartTotalCount();
};

const resetCartButton = () => {
	cart = [];
	renderCartSidebar();
	updateCartBadge();
};

const placeOrderButton = () => {
	const username = sessionStorage.getItem("username");
	if (cart.length === 0) return;

	if (!navCartSidebarPlaceOrder) return;
	const isEmpty = cart.length === 0;
	navCartSidebarPlaceOrder.disabled = isEmpty;

	createNewOrder(username, cart);

	cart = [];
	renderCartSidebar();
	updateCartBadge();
};

const openCartSidebar = () => {
	navCartSidebarContainer?.classList.remove("nav-cart-sidebar-animate");
};

const closeCartSidebar = () => {
	navCartSidebarContainer?.classList.add("nav-cart-sidebar-animate");
};

const addToCart = (productName, price) => {
	const numPrice = parseFloat(price);
	const existing = cart.find((item) => item.productName === productName);
	if (existing) {
		existing.quantity += 1;
	} else {
		cart.push({ productName, price: numPrice, quantity: 1 });
	}
	renderCartSidebar();
	updateCartBadge();
};

const updateQuantity = (productName, delta) => {
	const item = cart.find((item) => item.productName === productName);
	if (!item) return;
	item.quantity += delta;
	if (item.quantity <= 0) {
		removeFromCart(productName);
		return;
	}
	renderCartSidebar();
	updateCartBadge();
};

const removeFromCart = (productName) => {
	cart = cart.filter((item) => item.productName !== productName);
	renderCartSidebar();
	updateCartBadge();
};

// Cart button: open sidebar
navCartButton?.addEventListener("click", openCartSidebar);

// Close button: close sidebar
navCartSidebarButton?.addEventListener("click", closeCartSidebar);

// Reset: clear cart, re-render, close sidebar
navCartSidebarReset?.addEventListener("click", resetCartButton);

navCartSidebarPlaceOrder?.addEventListener("click", placeOrderButton);

// Add to Cart from menu cards (event delegation: works for elements created in renderMenus)
menuBody?.addEventListener("click", (e) => {
	const btn = e.target.closest(".add-to-cart-btn");
	if (!btn) return;
	// classList = DOMTokenList (use .contains(), .add(), .remove()); className = string
	if (btn.classList.contains("add-to-cart-btn")) {
		const productName = btn.getAttribute("data-product");
		const price = btn.getAttribute("data-price") || "0";
		addToCart(productName, price);
	}
});

// Initial render (empty cart), badge, and place-order button state
renderCartSidebar();
updateCartBadge();
retrieveHomepageData();
