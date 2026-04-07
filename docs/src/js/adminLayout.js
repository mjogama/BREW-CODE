/**
 * Hamburger + backdrop for the admin sidebar on narrow viewports.
 */
export function initAdminLayout() {
	const sidebar = document.getElementById("sidebar");
	const toggle = document.getElementById("sidebarToggle");
	if (!sidebar || !toggle) return;

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
