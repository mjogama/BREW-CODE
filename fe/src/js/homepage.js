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

const retrieveUserInfoPath = "/user";
const createNewOrderPath = "/order/new";

// Cart state: each item is { productName, price, quantity }
let cart = [];
let totalAmount = 0;

const retrieveUserInfo = async () => {
	const accessToken = sessionStorage.getItem("accessToken");

	if (!accessToken) {
		window.location.href = "./login.html";
		return;
	}

	const response = await fetch(`http://localhost:8000/api${retrieveUserInfoPath}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
		credentials: "include",
	});

	if (!response.ok) {
		window.location.href = "./login.html";
		return;
	}

	const data = await response.json();

	sessionStorage.setItem("productQuantity", productQuantity.length);
	sessionStorage.setItem("username", data.details?.data?.fullName);

	if (navUsername && data.details?.data?.fullName) {
		navUsername.textContent = data.details.data.fullName;
	}
};

const createNewOrder = async (username, purchasedProducts) => {
	const accessToken = sessionStorage.getItem("accessToken");

	if (!accessToken) {
		window.location.href = "./login.html";
		return;
	}

	const response = await fetch(`http://localhost:8000/api${createNewOrderPath}`, {
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

	console.log(data);
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

// Add to Cart from menu cards
document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		const productName = btn.getAttribute("data-product");
		const price = btn.getAttribute("data-price") || "0";
		addToCart(productName, price);
	});
});

// Initial render (empty cart), badge, and place-order button state
renderCartSidebar();
updateCartBadge();
retrieveUserInfo();
