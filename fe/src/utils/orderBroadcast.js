export const ORDERS_BROADCAST_CHANNEL = "brew-code-orders";

/** Notifies other tabs (e.g. Analytics) that order data changed so they can refetch. */
export function notifyOrdersChanged() {
	try {
		const ch = new BroadcastChannel(ORDERS_BROADCAST_CHANNEL);
		ch.postMessage({ type: "orders-changed" });
		ch.close();
	} catch {
		// BroadcastChannel unavailable
	}
}
