const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		eventName: { type: String, required: true },
		time: { type: String, required: true },
		enable: { type: Boolean, required: true },
	},
	{ timestamps: true, minimize: false }
);

schema.index({ companyRegisteredDomain: 1 }, { unique: true });

module.exports = {
	schema: schema,
	CronJobsModel: Mongoose.model("cron_jobs", schema),
};
