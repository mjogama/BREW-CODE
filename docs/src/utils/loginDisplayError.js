const loginDisplayError = (input) => {
	input.textContent = "Invalid email or password";
	setTimeout(() => {
		input.textContent = "";
	}, 2000);
};

export default loginDisplayError;
