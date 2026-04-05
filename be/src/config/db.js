import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

function connectionErrorMessage(error) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	try {
		return JSON.stringify(error);
	} catch {
		return String(error);
	}
}

const connectDB = async () => {
	const uri = process.env.DB_URI;
	if (!uri || !String(uri).trim()) {
		throw new Error(
			"DB_URI is missing or empty. Set it in your environment (e.g. Vercel project Environment Variables).",
		);
	}
	try {
		await mongoose.connect(uri);
		console.log(`DB connected succesfully at ${mongoose.connection.db.databaseName}`);
	} catch (error) {
		throw new Error(`Database connection failed: ${connectionErrorMessage(error)}`);
	}
};

export default connectDB;
