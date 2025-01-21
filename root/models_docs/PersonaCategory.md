const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		categoryName: { type: String, required: true },
		personasUnderCategory: [
			{
				type: { type: String, required: true },
				id: { type: String, required: true },
			},
		],
		productUsageBadgeConfig: {
			highPercentile: { type: Number, required: true },
			mediumPercentile: { type: Number, required: true },
			lowPercentile: { type: Number, required: true },
			durationInMonth: { type: Number, required: true },
		},
		supportTicketsBadgeConfig: {
			highPercentile: { type: Number, required: true },
			mediumPercentile: { type: Number, required: true },
			lowPercentile: { type: Number, required: true },
			durationInMonth: { type: Number, required: true },
		},
		upgradeEventConfig: {
			durationInMonth: { type: Number, required: true },
		},
		headers: [
			{
				title: { type: String },
				key: { type: String },
				cellType: {
					type: String,
					enum: [
						"normalText",
						"tableChip",
						"colouredPercentageText",
						"coloredText",
						"starRating",
						"titleCell",
					],
				},
				color: { type: String, enum: ["success", "warning", "error"] },
				subTextForCell: { type: String },
			},
		],
	},
	{ timestamps: true, minimize: false }
);

module.exports = {
	schema: schema,
	PersonaCategoryModel: Mongoose.model("persona_category_config", schema),
};
