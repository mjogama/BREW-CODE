/**
 * Hamburger + backdrop for the admin sidebar on narrow viewports.
 */
export function initAdminLayout() {
	const sidebar = document.getElementById("sidebar");
	const toggle = document.getElementById("sidebarToggle");
	if (!sidebar || !toggle) return;

	// Set active sidebar nav item based on current page
	setActiveNavItem();

	let backdrop = document.querySelector(".sidebar-backdrop");
	if (!backdrop) {
		backdrop = document.createElement("div");
		backdrop.className = "sidebar-backdrop";
		backdrop.setAttribute("aria-hidden", "true");
		document.body.appendChild(backdrop);
	}

	const mq = window.matchMedia("(max-width: 768px)");

	function closeSidebar() {
		sidebar.classList.remove("open");
		backdrop.classList.remove("is-visible");
		document.body.classList.remove("admin-sidebar-open");
		toggle.setAttribute("aria-expanded", "false");
	}

	function openSidebar() {
		sidebar.classList.add("open");
		backdrop.classList.add("is-visible");
		document.body.classList.add("admin-sidebar-open");
		toggle.setAttribute("aria-expanded", "true");
	}

	toggle.addEventListener("click", () => {
		if (sidebar.classList.contains("open")) closeSidebar();
		else openSidebar();
	});

	backdrop.addEventListener("click", closeSidebar);

	sidebar.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			if (mq.matches) closeSidebar();
		});
	});

	mq.addEventListener("change", (e) => {
		if (!e.matches) closeSidebar();
	});
}

/**
 * Set the active sidebar nav item based on the current page filename.
 */
function setActiveNavItem() {
	const sidebar = document.getElementById("sidebar");
	if (!sidebar) return;

	// Get current page filename (e.g., "orders.html" or "admin.html")
	const currentPath = window.location.pathname;
	const currentPage = currentPath.split("/").pop() || "admin.html";

	// Mapping of page filenames to their nav item href values
	const pageToNavMap = {
		"admin.html": "./admin.html",
		"orders.html": "./orders.html",
		"customers.html": "./customers.html",
		"analytics.html": "./analytics.html",
	};

	const expectedHref = pageToNavMap[currentPage];

	// Remove active class from all items
	sidebar.querySelectorAll(".sidebar-nav-item").forEach((item) => {
		item.classList.remove("active");
	});

	// If no mapping found (e.g., hash links like #products), fall back to default behavior
	if (!expectedHref) return;

	// Find and activate the matching nav item
	const matchingItem = sidebar.querySelector(`.sidebar-nav-item a[href="${expectedHref}"]`)?.parentElement;
	if (matchingItem) {
		matchingItem.classList.add("active");
	}
}
