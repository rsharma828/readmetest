const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		label: { type: String, required: true },
	},
	{ timestamps: true, minimize: false }
);

schema.index({ label: 1 }, { unique: true });

module.exports = {
	schema: schema,
	ChallengesModel: Mongoose.model("challenges", schema),
};
