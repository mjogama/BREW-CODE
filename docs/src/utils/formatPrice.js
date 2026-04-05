const formatPrice = (value) => {
	const num = Number(value);
	return Number.isNaN(num) ? "₱0.00" : `₱${num.toFixed(2)}`;
};

export default formatPrice;
