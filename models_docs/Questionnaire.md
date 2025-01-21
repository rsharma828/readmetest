const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		companyId: { type: Schema.Types.ObjectId, required: true, ref: "companies" },
		teamSize: { type: Number, required: true },
		perMonthCancelSession: { type: Number, required: true },
		challenges: [{ type: Schema.ObjectId, required: true }],
	},
	{ timestamps: true, minimize: false }
);

schema.index({ companyId: 1 }, { unique: true });

module.exports = {
	schema: schema,
	QuestionnaireModel: Mongoose.model("questionnaire", schema),
};
