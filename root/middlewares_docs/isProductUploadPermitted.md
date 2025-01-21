/**
 * middleware for checking billing and ticketing data fetched
 * isProductUploadPermitted
 */
const { logger } = require("../utils");
module.exports = async (req, res, next, { Services /* ,config */ }) => {
	const isBillingUploaded = req.onboardingDetails.billingPlatform.isUploaded;
	const isTicketingDataUploaded = req.onboardingDetails.ticketingPlatform.isUploaded;
	if (isBillingUploaded && isTicketingDataUploaded) {
		next();
	} else {
		return res.status(403).json({
			success: false,
			message: "Billing and Ticketing data not fully fetched. Please wait till data fetching is completed.",
		});
	}
};
