const { logger } = require("utils");
const Joi = require("joi");

module.exports.routes = function (props) {
	const {
		Services: { Freshdesk },
	} = props;
	return {
		"POST /connect": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				const { body, user, onboardingDetails } = req;
				const userEmail = user.emailId;
				try {
					const connected = await Freshdesk.connect({ body, user });
					if (!connected.success) {
						return res.status(400).json(connected);
					}

					res.status(200).json(connected);

					logger.info(`Data fetching has started from freshdesk for userEmail ${userEmail}.`);
					Freshdesk.fetchAndAddData({ user, onboardingDetails });
					return;
				} catch (error) {
					logger.error(error);
					if (!res.headersSent && error.http_status_code) {
						return res.status(error.http_status_code).json({ success: false, message: error.message });
					}
					if (!res.headersSent) {
						if (
							error.message &&
							(error.message ===
								"Request processing failed: Freshdesk Error (400): Bad Request - Invalid attribute: You passed an invalid value for the id attribute. Invalid parameter: id must be an integer from api/v2/organizations/related" ||
								error.message === "Request processing failed: Freshdesk Error (404): Item not found")
						) {
							return res.status(400).json({ success: false, message: "Invalid Organization Id." });
						}
					}
					logger.error(
						`Failed to fetch data from freshdesk for userEmail ${userEmail}. `,
						`error message: ${error.message}`
					);
					return res.status(500).json({ success: false, message: "Internal Server Error." });
				}
			},
		},
		"GET /fetchData": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const { user, onboardingDetails } = req;
					// Send the response before starting the background task
					res.status(200).json({ success: true, message: "Request received, processing in background" });

					// Run the data fetching in the background
					Freshdesk.fetchAndAddData({ user, onboardingDetails }).catch((fetchError) =>
						logger.error(`Error fetching data for user ${companyId}:`, fetchError)
					);
				} catch (error) {
					logger.error(error);
					if (error.http_status_code) {
						return res.status(error.http_status_code).json({ success: false, message: error.message });
					}
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
	};
};

const validate = (data, endpointName) => {
	const schema = {
		connect: Joi.object({
			userEmail: Joi.string().required(),
			apiKeyId: Joi.string().required(),
			subdomain: Joi.string().required(),
		}),
	};
	return schema[endpointName].validate(data);
};
