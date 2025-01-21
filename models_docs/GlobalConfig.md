const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		industryType: { type: String, required: true },
		retExpCount: { type: Number, default: 5 },
		productUsageWeights: {
			feat1Weight: { type: Number, default: 60 },
			feat2Weight: { type: Number, default: 40 },
		},
		isPersonaMappingAllowed: { type: Boolean, default: true },
		personaMappingStatus: { type: Boolean, enum: ["IN_PROGRESS", "FAILED", null], default: null },
	},
	{ timestamps: true, minimize: false }
);

schema.index(
	{
		industryType: 1,
		retExpCount: 1,
		productUsageWeights: 1,
		isPersonaMappingAllowed: 1,
		personaMappingStatus: 1,
	},
	{ unique: true }
);

module.exports = {
	schema: schema,
	GlobalConfigModel: Mongoose.model("global_config", schema),
};
