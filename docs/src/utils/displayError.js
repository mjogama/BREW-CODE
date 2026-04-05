const displayError = (input, errorEl, message = "This section is required") => {
	input.classList.add("error-focus");
	errorEl.textContent = message;
	setTimeout(() => {
		input.classList.remove("error-focus");
		errorEl.textContent = "";
	}, 2000);
};

export default displayError;
