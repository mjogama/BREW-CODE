const animateCount = (element, target, durationMs = 1200) => {
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
};

export default animateCount;
