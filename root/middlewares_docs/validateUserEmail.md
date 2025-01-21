/**
 * middleware for validating user email and fetching companyId from user email
 * validateUserEmail
 */
const Joi = require("joi");
const { logger } = require("../utils");
module.exports = async (req, res, next, { Services /* ,config */ }) => {
	const { userEmail } = req.body;

	baseUrl = req.baseUrl.replace("/", "").toLowerCase();

	if (!userEmail) {
		return res.status(400).json({ success: false, message: "userEmail is missing." });
	}

	try {
		const { error } = validate(req.body, "connect" + "_" + baseUrl);

		if (error) {
			const errorMessage = error.details[0]?.message || "Joi validation failed.";
			logger.warn(`Validation error: ${errorMessage}`, { userEmail });
			return res.status(400).json({
				success: false,
				error: errorMessage,
			});
		}

		let user = await Services.UserEnrichmentData.findUserWithCompany({ emailId: userEmail });

		if (!user.success) {
			return res.status(400).json({
				succes: false,
				message: "User not found.",
			});
		}

		req.body.user = user.user;

		req.body.onboardingDetails = await Services.OnboardingDetails.findOne({
			companyId: user.user.companyId._id,
		});
		next();
	} catch (error) {
		logger.error(error);
		return res.status(403).json({ success: false, message: error.message });
	}
};

const validate = (data, endpointName) => {
	const schema = {
		connect_chargebee: Joi.object({
			userEmail: Joi.string().email().required(),
			apiKey: Joi.string().required(),
			site: Joi.string().required(),
		}),
		connect_freshdesk: Joi.object({
			userEmail: Joi.string().required(),
			apiKeyId: Joi.string().required(),
			subdomain: Joi.string().required(),
		}),
		connect_recurly: Joi.object({
			userEmail: Joi.string().required(),
			apiKey: Joi.string().required(),
		}),
		connect_stripe: Joi.object({
			userEmail: Joi.string().required(),
			apiKey: Joi.string().required(),
		}),
		connect_zendesk: Joi.object({
			userEmail: Joi.string().email().required(),
			username: Joi.string().email().required(),
			subdomain: Joi.string().required(),
			token: Joi.string().required(),
			organizationId: Joi.string().required(),
		}),
		connect_productusagedata: Joi.object({
			userEmail: Joi.string().email().required(),
		}),
	};
	return schema[endpointName].validate(data);
};
