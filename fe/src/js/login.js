import { loginAPI } from "../api/loginAPI/loginForm.js";
import displayError from "../utils/displayError.js";

// Form elements
const loginFormButton = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// display response error
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

// path

const baseURL = "http://localhost:8000/api";
const loginPath = "/user/login";

const loginFormHandler = async (e) => {
	e.preventDefault();

	const userData = {
		email: email.value.trim(),
		password: password.value.trim(),
	};

	if (!userData.email) return displayError(email, emailError);
	if (!userData.password) return displayError(password, passwordError);

	const data = await loginAPI(userData);

	if (data.errorTitle) {
		return displayError(email, emailError, data.details.errorMessage);
	}

	if (!data.details.token) {
		return displayError(email, emailError, "No Token provided");
	}

	sessionStorage.setItem("accessToken", data.details.token);
	if (data.details.rfToken) {
		sessionStorage.setItem("refreshToken", data.details.rfToken);
	}

	const token = data.details.token;
	const payload = JSON.parse(atob(token.split(".")[1]));

	const ALLOWED_ROLES = ["customer", "admin"];
	const role = payload?.role;

	if (!role || !ALLOWED_ROLES.includes(role)) {
		sessionStorage.removeItem("accessToken");
		sessionStorage.removeItem("refreshToken");
		emailError.textContent = "Unauthorized role. Please contact support.";
		setTimeout(() => {
			emailError.textContent = "";
		}, 3000);
		return;
	}

	const redirectPath = role === "admin" ? "./admin.html" : "./homepage.html";

	window.location.href = redirectPath;
	email.value = "";
	password.value = "";
};

const togglePasswordHandler = (e) => {
	e.preventDefault();

	if (password.type === "password") {
		password.type = "text";
	} else {
		password.type = "password";
	}
};

loginFormButton?.addEventListener("submit", loginFormHandler);
togglePassword?.addEventListener("click", togglePasswordHandler);
