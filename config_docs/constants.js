/**
 * constants.js
 * this is the file where server wide constants are defined and are referenced
 * using "config.CONSTANTS"
 */
module.exports = {
	userRoles: {
		retentionAdmin: "RETENTION_ADMIN",
		retentionExpert: "RETENTION_EXPERT",
		kaleAdmin: "SUPER_ADMIN",
	},
	allowedImageMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/bmp"],
	slackBotScope: [
		"channels:read",
		"chat:write",
		"chat:write.customize",
		"groups:read",
		"im:read",
		"Incoming-webhook",
		"Mpim:read",
		"users:read",
	],
	slackRedirectUri: "https://app-dev.kalehq.com/onboarding",
	thrivestackBaseUrl: "https://api.app.thrivestack.ai",
	thrivestackKey: process.env.KEY_ID,
	thrivestackPrivateKey: process.env.PRIVATE_KEY,
	kaleEmailSenderAddress: process.env.EMAIL_DOMAIN,
	emailTemplatesPath: "./config/email_templates",
	webWorkerBaseUrl: process.env.WEB_WORKER_BASE_URL,
	workOSAPIKey: process.env.WORKOS_API_KEY,
	workOSClientId: process.env.WORKOS_CLIENT_ID,
	defaultPageSize: 9999,
	mediaContainerName: {
		userProfilePictures: "profile-pictures",
		cardImages: "card-elements-images",
		cardVideo: "card-elements-videos",
		templateImages: "template-thumbnails",
		clientMedia: "client-media",
		onboardingVideos: "onboarding-videos",
	},
	workOsOrganizationState: {
		pending: "pending",
		verified: "verified",
	},
	workOSRoleSlug: {
		retentionAdmin: "retention-admin",
		retentionExpert: "retention-expert",
		superAdmin: "super-admin",
	},
	workOSRoleSlugMap: {
		"retention-admin": "RETENTION_ADMIN",
		"retention-expert": "RETENTION_EXPERT",
		"super-admin": "SUPER_ADMIN",
	},
	emailTemplates: {
		inviteRetExpert: "Email_Invitation_RE",
		notificationRA: "Email_Notification_RA",
		segmentationDataRefresh: "Segmentation_Data_Refresh",
		offerCode: "Offer_Code",
	},
	cronEventName: {
		refreshPlatformData: "REFRESH_PLATFORM_DATA", // run at 12:AM every day
	},
	publicEmailDomains: [
		"gmail.com",
		"yahoo.com",
		"hotmail.com",
		"aol.com",
		"outlook.com",
		"icloud.com",
		"mail.com",
		"protonmail.com",
		"zoho.com",
		"yandex.com",
		"gmx.com",
		"qq.com",
		"naver.com",
		"live.com",
		"me.com",
		"rediffmail.com",
		"fastmail.com",
		"msn.com",
		"rocketmail.com",
		"mail.ru",
		"hushmail.com",
	],
	defaultTemplateThumbnailURI:
		"https://rgdevkalehqstorage.blob.core.windows.net/template-thumbnails/template_default_image.png",
	defaultCardImage: "https://rgdevkalehqstorage.blob.core.windows.net/card-elements-images/card_default_image.png",
};
