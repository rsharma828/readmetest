const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		personaType: { type: String, required: true },
		industryType: { type: String, required: true, default: "general" },
		isActive: { type: Boolean, required: true, default: true },
		category: { type: String, required: true },
		description: [{ type: String, required: true }],
		productRule: {
			mainRule: { type: Object /*required: true*/ },
			additionalRule: { type: Object },
		},
		billingRule: {
			mainRule: { type: Object /*required: true*/ },
			additionalRule: { type: Object },
		},
		ticketingRule: {
			mainRule: { type: Object /*required: true*/ },
			additionalRule: { type: Object },
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

schema.index(
	{
		personaType: 1,
		industryType: 1,
	},
	{ unique: true }
);

module.exports = {
	schema: schema,
	PersonaConfigModel: Mongoose.model("persona_config", schema),
};
