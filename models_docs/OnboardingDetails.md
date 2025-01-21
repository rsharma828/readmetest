const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema(
	{
		companyId: { type: Schema.Types.ObjectId, required: true, ref: "companies" },
		currentScreen: { type: String },
		questionnaireSubmitted: { type: Boolean },
		onboardingSkip: { type: Boolean },
		billingPlatform: {
			platformName: { type: String },
			apiKeyId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			siteId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			clientId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			clientSecret: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			isConnected: { type: Boolean },
			isUploaded: { type: Boolean },
			refreshStatus: { type: String, enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"] },
			lastUploadDate: { type: Date },
		},
		ticketingPlatform: {
			platformName: { type: String },
			apiKeyId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			siteId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			clientId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			clientSecret: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			usernameId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			subdomainId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			tokenId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			organizationId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			isConnected: { type: Boolean },
			isUploaded: { type: Boolean },
			refreshStatus: { type: String, enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"] },
			lastUploadDate: { type: Date },
			lastSavedCursor: { type: String },
		},
		alerts: {
			platformName: { type: String, default: "slack" },
			clientId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			clientSecret: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			refreshToken: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			tokenExpiry: { type: Date },
			token: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			channelId: {
				type: String,
				set: function (value) {
					return value === "" ? undefined : value;
				},
			},
			isConnected: { type: Boolean, default: false },
		},
		productUsageUpload: {
			isSuccessful: { type: Boolean },
			isUploaded: { type: Boolean },
			filename: { type: String },
			fileSize: { type: String },
			rowCount: { type: Number },
			errorCount: { type: Number },
			errorFileUrl: { type: String },
			errorMessage: [{ type: Object }],
			lastUploadDate: { type: Date },
		},
		customerDataUpload: {
			isSuccessful: { type: Boolean },
			isUploaded: { type: Boolean },
			filename: { type: String },
			fileSize: { type: String },
			rowCount: { type: Number },
			errorCount: { type: Number },
			errorFileUrl: { type: String },
			errorMessage: [{ type: Object }],
			lastUploadDate: { type: Date },
		},
	},
	{ timestamps: true, minimize: false }
);

schema.index({ companyId: 1 }, { unique: true });

module.exports = {
	schema: schema,
	OnboardingDetailsModel: Mongoose.model("onboardingDetails", schema),
};
