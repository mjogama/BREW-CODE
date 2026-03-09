import mongoose from "mongoose";

import ErrorHandler from "./ErrorHandler.js";

const validateObjectId = (id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		ErrorHandler("ID not found or Invalid", 404);
	}
};

export default validateObjectId;
