import { signupAPI } from "../api/signupAPI/signupForm.js";
import displayError from "../utils/displayError.js";

const signupFormButton = document.getElementById("signupForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const agreeTerms = document.getElementById("agreeTerms");
const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

// Map API error path (e.g. "email", "emailError") → input + error element
const fieldByPath = {
	fullName: { input: fullName, errorEl: fullNameError },
	fullNameError: { input: fullName, errorEl: fullNameError },
	email: { input: email, errorEl: emailError },
	emailError: { input: email, errorEl: emailError },
	password: { input: password, errorEl: passwordError },
	passwordError: { input: password, errorEl: passwordError },
};

const signupFormHandler = async (e) => {
	e.preventDefault();

	if (!fullName.value.trim()) return displayError(fullName, fullNameError);

	if (!email.value.trim()) return displayError(email, emailError);

	if (!password.value.trim()) return displayError(password, passwordError);

	if (!agreeTerms.checked) return;

	const userData = {
		fullName: fullName.value.trim(),
		email: email.value.trim(),
		password: password.value.trim(),
		agreeTerms: agreeTerms.checked,
	};

	const data = await signupAPI(userData);

	if (data.errorTitle) {
		const details = data.details ?? {};
		const path = details.errorPath;
		const msg = details.errorMessage ?? "Signup failed";
		const message = Array.isArray(msg) ? msg[0] : msg;
		const pathKey = Array.isArray(path) ? path[0] : path;
		const field = pathKey != null ? fieldByPath[pathKey] : null;

		if (field) {
			displayError(field.input, field.errorEl, message);
		} else {
			displayError(email, emailError, message);
		}
		return;
	}

	window.location.href = "./login.html";

	fullName.value = "";
	email.value = "";
	password.value = "";
	agreeTerms.checked = false;
};

const togglePasswordHandler = (e) => {
	e.preventDefault();
	if (password.type === "password") {
		password.type = "text";
	} else {
		password.type = "password";
	}
};

signupFormButton?.addEventListener("submit", signupFormHandler);
togglePassword?.addEventListener("click", togglePasswordHandler);
