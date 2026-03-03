import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		purchasedProducts: [
			{
				_id: false,
				productName: {
					type: String,
					required: true,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
				quantity: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "ongoing", "finished"],
			default: "pending",
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

orderSchema.index({ userId: 1 }, { createdAt: -1 });

export default mongoose.models.OrderSchema || mongoose.model("OrderSchema", orderSchema, "brew-code-orders");
