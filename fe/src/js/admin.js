const navbarName = document.getElementById("navbarName");
const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRevenueEl = document.getElementById("totalRevenue");

const baseURL = "http://localhost:8000/api";
const pathAdmin = "/user/admin";
const pathTotalOrders = "/order/totalOrders";
const pathTotalRevenue = "/order/revenue";

function animateCount(element, target, durationMs = 1200) {
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
}

const fetchAdminData = async () => {
	const accessToken = sessionStorage.getItem("accessToken");

	if (!accessToken) {
		window.location.href = "./login.html";
		return;
	}

	const productQuantity = parseInt(localStorage.getItem("productQuantity"));

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
};

fetchAdminData();
