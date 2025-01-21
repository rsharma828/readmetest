const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
	{
		emailId: { type: String, required: true },
		firstName: { type: String },
		lastName: { type: String },
		role: { type: String, enum: ["SUPER_ADMIN", "RETENTION_ADMIN", "RETENTION_EXPERT"] },
		profilePicUrl: {
			type: String,
			default: "https://rgprodkalehqstorage.blob.core.windows.net/profile-pictures/dummy-img.jpeg",
		},
		inviteStatus: { type: String, enum: ["ACCEPTED", "PENDING"] },
		companyId: { type: Schema.Types.ObjectId, ref: "companies" },
	},
	{ timestamps: true, minimize: false }
);

schema.index({ emailId: 1 }, { unique: true });

module.exports = {
	schema: schema,
	UserProfilesModel: mongoose.model("userProfiles", schema),
};
