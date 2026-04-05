const regexHTMLHandler = (str) => {
	if (!str) return "";

	return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export default regexHTMLHandler;
