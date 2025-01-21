const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		companyRegisteredDomain: { type: String, required: true },
		organizationId: { type: String, required: true },
		enrichedData: { type: Object },
		industryType: { type: String, default: "general" },
	},
	{ timestamps: true, minimize: false }
);

schema.index({ companyRegisteredDomain: 1 }, { unique: true });

module.exports = {
	schema: schema,
	CompaniesModel: Mongoose.model("companies", schema),
};
