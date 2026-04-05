import { retrieveTotalProductsAPI, retriveTotalOrdersAPI, retrieveTotalCustomersAPI, retriveTotalRevenueAPI } from "../api/adminAPI/stats.js";
import { retrieveProductsSaleAPI } from "../api/analyticsAPI/analyticsData.js";
import animateCount from "../utils/animateCount.js";
import { ORDERS_BROADCAST_CHANNEL } from "../utils/orderBroadcast.js";

// stats elements
const navbarName = document.getElementById("navbarName");
const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRevenueEl = document.getElementById("totalRevenue");

let salesChart = null;
let refreshInFlight = null;

export const retrieveGraphData = async () => {
	if (typeof Chart === "undefined") return;

	const productsSale = await retrieveProductsSaleAPI();
	if (!Array.isArray(productsSale)) return;

	const nameProductsSale = productsSale.map((product) => product.name);
	const soldProductsSale = productsSale.map((product) => product.productsSold);

	const productGraph = document.getElementById("productGraph");
	if (!productGraph) return;

	if (salesChart) {
		salesChart.destroy();
		salesChart = null;
	}

	salesChart = new Chart(productGraph, {
		type: "bar",
		data: {
			labels: nameProductsSale,
			datasets: [
				{
					label: "Product Sold",
					data: soldProductsSale,
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	});
};

const retrieveStatsData = async () => {
	const totalProducts = await retrieveTotalProductsAPI();
	const totalOrders = await retriveTotalOrdersAPI();
	const totalCustomers = await retrieveTotalCustomersAPI();
	const totalRevenue = await retriveTotalRevenueAPI();

	if (navbarName && totalCustomers?.data) {
		navbarName.textContent = totalCustomers.data.fullName;
	}

	animateCount(totalProductsEl, totalProducts ?? 0);
	animateCount(totalOrdersEl, totalOrders ?? 0);
	animateCount(totalCustomersEl, totalCustomers.totalCustomers ?? 0);
	animateCount(totalRevenueEl, totalRevenue ?? 0);

	await retrieveGraphData();
};

/** Refetch stats + chart (e.g. after a new order). Safe to call from BroadcastChannel or focus handlers. */
export function refreshAnalyticsDashboard() {
	if (!totalProductsEl || !navbarName) return Promise.resolve();

	if (refreshInFlight) return refreshInFlight;

	refreshInFlight = (async () => {
		try {
			await retrieveStatsData();
		} finally {
			refreshInFlight = null;
		}
	})();

	return refreshInFlight;
}

refreshAnalyticsDashboard();

try {
	const ordersChannel = new BroadcastChannel(ORDERS_BROADCAST_CHANNEL);
	ordersChannel.onmessage = (ev) => {
		if (ev?.data?.type === "orders-changed") {
			refreshAnalyticsDashboard();
		}
	};
} catch {
	// BroadcastChannel unavailable
}
