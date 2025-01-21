const Mongoose = require("mongoose");
const { Schema } = Mongoose;
const constants = require("config/constants");

const schema = new Schema(
	{
		templateName: { type: String, required: true },
		status: { type: String, enum: ["ACTIVE", "DRAFT", "INACTIVE"], required: true },
		description: { type: String, default: "" },
		thumbnailUrl: { type: String, default: constants.defaultTemplateThumbnailURI },
		clientUsage: { type: Number, default: 0 },
		workflowCount: { type: Number, default: 0 },
		sessionUsage: { type: Number, default: 0 },
		successRate: { type: Number, default: 0 },
		openRate: { type: Number, default: 0 },
		mrrSaved: { type: Number, default: 0 },
		personaMapped: [{ type: String }],
		createdBy: { type: Schema.ObjectId, default: null },
		flowType: { type: String, required: true, enum: ["CANCELLATION", "ENGAGEMENT"] },
		engagementType: [{ type: String, enum: ["ONBOARDING", "ADOPTION", "ADVOCACY", ""], default: "" }],
	},
	{ timestamps: true, minimize: false }
);

schema.index({ templateName: 1 }, { unique: true });

module.exports = {
	schema: schema,
	TemplateModel: Mongoose.model("templates", schema),
};
