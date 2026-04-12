import { retrieveTotalProductsAPI, retriveTotalOrdersAPI, retrieveTotalCustomersAPI, retriveTotalRevenueAPI } from "../api/adminAPI/stats.js";
import { retrieveProductsSaleAPI } from "../api/analyticsAPI/analyticsData.js";
import animateCount from "../utils/animateCount.js";
import { ORDERS_BROADCAST_CHANNEL } from "../utils/orderBroadcast.js";
import { initAdminLayout } from "./adminLayout.js";

// stats elements
const navbarName = document.getElementById("navbarName");
const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRevenueEl = document.getElementById("totalRevenue");

// skeleton elements
const statsSkeleton = document.getElementById("statsSkeleton");
const statsStrip = document.getElementById("statsStrip");
const chartSkeleton = document.getElementById("chartSkeleton");
const productGraph = document.getElementById("productGraph");

let salesChart = null;
let chartResizeObserver = null;
let refreshInFlight = null;

const disconnectChartResizeObserver = () => {
	chartResizeObserver?.disconnect();
	chartResizeObserver = null;
};

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
	disconnectChartResizeObserver();

	const isNarrow = typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches;

	salesChart = new Chart(productGraph, {
		type: "bar",
		data: {
			labels: nameProductsSale,
			datasets: [
				{
					label: "Sold Products",
					data: soldProductsSale,
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			resizeDelay: 0,
			layout: {
				padding: { top: 8, right: 8, bottom: 4, left: 4 },
			},
			plugins: {
				legend: {
					display: true,
					position: "top",
					labels: {
						boxWidth: 14,
						padding: 10,
						font: { size: isNarrow ? 11 : 12, family: "'Segoe UI', system-ui, sans-serif" },
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			scales: {
				x: {
					ticks: {
						maxRotation: isNarrow ? 55 : 40,
						minRotation: 0,
						autoSkip: true,
						font: { size: isNarrow ? 10 : 11 },
					},
					grid: { display: false },
				},
				y: {
					beginAtZero: true,
					ticks: {
						precision: 0,
						font: { size: isNarrow ? 10 : 11 },
					},
					border: { display: false },
				},
			},
		},
	});

	const frameEl = productGraph.closest(".analytics-chart-frame");
	if (frameEl && typeof ResizeObserver !== "undefined") {
		chartResizeObserver = new ResizeObserver(() => {
			if (salesChart) salesChart.resize();
		});
		chartResizeObserver.observe(frameEl);
	}
};

const retrieveStatsData = async () => {
	// Show skeletons before fetching
	statsSkeleton?.classList.remove("skeleton-hidden");
	statsStrip?.classList.add("skeleton-hidden");
	chartSkeleton?.classList.remove("skeleton-hidden");
	productGraph?.classList.add("skeleton-hidden");

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

	// Hide skeletons after data is loaded
	statsSkeleton?.classList.add("skeleton-hidden");
	statsStrip?.classList.remove("skeleton-hidden");
	chartSkeleton?.classList.add("skeleton-hidden");
	productGraph?.classList.remove("skeleton-hidden");
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

initAdminLayout();
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
