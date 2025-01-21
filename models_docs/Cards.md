const Mongoose = require("mongoose");
const { Schema } = Mongoose;
const constants = require("config/constants");

const schema = new Schema(
	{
		label: { type: String, required: true },
		videoId: { type: Object },
		imageUrl: { type: Object },
		templateId: { type: Schema.Types.ObjectId, ref: "templates" },
		cardThumbnailUrl: { type: String, default: constants.defaultCardImage },
		videoThumbnailUrl: { type: String, default: constants.defaultCardImage },
		parentId: { type: Schema.Types.ObjectId },
		parentBranchId: { type: String },
	},
	{ timestamps: true, minimize: false }
);

module.exports = {
	schema: schema,
	CardsModel: Mongoose.model("cards", schema),
};
