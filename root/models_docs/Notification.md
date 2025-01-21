const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		workflowId: { type: Schema.ObjectId, required: true },
		userEmail: { type: String, required: true },
		isUnseen: { type: Boolean, required: true },
		userResponse: { type: Object },
	},
	{ timestamps: true, minimize: false }
);

schema.index({ label: 1, containerName: 1, mimeType: 1 }, { unique: true });

module.exports = {
	schema: schema,
	NotificationModel: Mongoose.model("notification", schema),
};
