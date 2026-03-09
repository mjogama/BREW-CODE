import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		emoji: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

productSchema.index({ createdAt: -1 });

export default mongoose.models.Product || mongoose.model("Product", productSchema, "brew-code-products");
