import {
	createNewOrderAPI,
	retrieveUserDataAPI,
	retrieveMenuAPI,
} from "../api/homepageAPI/homepageData.js";
import renderMenus from "../helpers/homepage/renderMenuHelper.js";

const navUsername = document.getElementById("navUsername");
const cartCountBadge = document.getElementById("cartCount");
const navCartButton = document.getElementById("navCartButton");

const navCartSidebarContainer = document.getElementById("navCartSidebarContainer");
const navCartSidebarButton = document.getElementById("navCartSidebarButton");
const navCartSidebarReset = document.getElementById("navCartSidebarReset");
const navCartSidebarPlaceOrder = document.getElementById("navCartSidebarPlaceOrder");
const navCartSidebarItems = document.getElementById("navCartSidebarItems");
const navCartSidebarAddMore = document.getElementById("navCartSidebarAddMore");
const navCartSidebarModalCountdown = document.getElementById("navCartSidebarModalCountdown");
const navCartSidebarAddMoreYes = document.getElementById("navCartSidebarAddMoreYes");
const navCartSidebarAddMoreNo = document.getElementById("navCartSidebarAddMoreNo");

const displayOrderTotalAmount = document.getElementById("displayOrderTotalAmount");

const menuBody = document.getElementById("menuBody");

// Cart state: each item is { productName, price, quantity }
let cart = [];
let totalAmount = 0;
let count = 10;
let modalCountdown;

const retrieveHomepageData = async () => {
	const accessToken = sessionStorage.getItem("accessToken");

	if (!accessToken) {
		window.location.href = "./login.html";
		return;
	}

	const userResult = await retrieveUserDataAPI();

	const menuResult = await retrieveMenuAPI();

	renderMenus(menuResult);

	if (navUsername && userResult) {
		navUsername.textContent = userResult;
	}
};

const createNewOrder = async (purchasedProducts) => {
	const accessToken = sessionStorage.getItem("accessToken");

	if (!accessToken) {
		window.location.href = "./login.html";
		return;
	}

	await createNewOrderAPI(purchasedProducts, totalAmount);

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
	if (cart.length === 0) return;

	if (!navCartSidebarPlaceOrder || !navCartSidebarModalCountdown) return;
	const isEmpty = cart.length === 0;
	navCartSidebarPlaceOrder.disabled = isEmpty;

	// Stop any existing countdown so it doesn't conflict with the new one
	if (modalCountdown) {
		clearInterval(modalCountdown);
		modalCountdown = null;
	}

	// Start fresh: countdown from 10, display in sync with interval
	count = 10;
	navCartSidebarModalCountdown.textContent = count;
	navCartSidebarAddMore.classList.remove("is-hidden");

	modalCountdown = setInterval(() => {
		count--;
		navCartSidebarModalCountdown.textContent = count;

		if (count === 3) {
			navCartSidebarModalCountdown.classList.add("is-text-red");
		}

		if (count <= 0) {
			clearInterval(modalCountdown);
			modalCountdown = null;
			createNewOrder(cart);
			cart = [];
			renderCartSidebar();
			updateCartBadge();
			closeCartSidebar();
			navCartSidebarAddMore.classList.add("is-hidden");
		}
	}, 1000);
	navCartSidebarModalCountdown.classList.remove("is-text-red");
};

const modalPlaceOrderYesButton = () => {
	if (modalCountdown) {
		clearInterval(modalCountdown);
		modalCountdown = null;
	}
	count = 10;
	if (navCartSidebarModalCountdown) navCartSidebarModalCountdown.textContent = count;
	navCartSidebarAddMore.classList.add("is-hidden");
};

const modalPlaceOrderNoButton = () => {
	if (modalCountdown) {
		clearInterval(modalCountdown);
		modalCountdown = null;
	}
	createNewOrder(cart);
	cart = [];
	renderCartSidebar();
	updateCartBadge();
	closeCartSidebar();
	navCartSidebarAddMore.classList.add("is-hidden");
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

navCartSidebarAddMoreYes?.addEventListener("click", modalPlaceOrderYesButton);

navCartSidebarAddMoreNo?.addEventListener("click", modalPlaceOrderNoButton);

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
