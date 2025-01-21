/**
 * conf.js
 * this is the main config file and can be accessed through the "config" dependency
 * which is injected in both controllers and middlewares
 */
module.exports = {
	slackRedirectUri: "https://app-dev.kalehq.com/onboarding",
	thrivestackBaseUrl: "https://api.app.thrivestack.ai",
	kaleEmailSenderAddress: "DoNotReply@notifications.kalehq.com",
	emailTemplatesPath: "./config/email_templates",
	thrivestackEvents: {
		account_created: "acknowledgeTenant",
		account_added_user: "acknowledgeTenantJoinRequest",
		company_enrichment: "insertCompanyEnrichment",
		user_enrichment: "insertUserEnrichment",
	},
	workOSEvents: {
		"user.created": "createUser",
		"user.updated": "updateUser",
		"user.deleted": "deleteUser",
		"organization_membership.updated": "updateUserRole",
	},
	signUpUrl: process.env.SIGNUP_URL,
	loginUrl: process.env.LOGIN_URL,
};
