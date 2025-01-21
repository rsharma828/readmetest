const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		emailId: { type: String, required: true },
		enrichedData: { type: Object },
	},
	{ timestamps: true, minimize: false }
);

schema.index({ emailId: 1 }, { unique: true });

module.exports = {
	schema: schema,
	UserEnrichmentDataModel: Mongoose.model("user_enrichment_data", schema),
};
