const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		label: { type: String, required: true },
		mimeType: { type: String, required: true },
		containerName: { type: String, required: true },
		fileUrl: { type: String, required: true },
	},
	{ timestamps: true, minimize: false }
);

module.exports = {
	schema: schema,
	MediaModel: Mongoose.model("media", schema),
};
