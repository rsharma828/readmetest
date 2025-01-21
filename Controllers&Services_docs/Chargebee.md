const { logger } = require("utils");
const Joi = require("joi");

module.exports.routes = function (props) {
	const {
		Services: { Chargebee },
	} = props;
	return {
		"POST /connect": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				const { body, user, onboardingDetails } = req;
				const userEmail = user.emailId;
				try {
					const connectionResult = await Chargebee.connect({ body, user });
					if (!connectionResult.success) {
						logger.warn("Chargebee connection failed:", { userEmail, error: connectionResult.message });
						return res.status(400).json(connectionResult);
					}

					res.status(200).json(connectionResult);
					logger.info(`Data fetching has started from Chargebee for userEmail ${userEmail}.`);

					await Chargebee.fetchAndAddData({ user, onboardingDetails });
					logger.info(`Data fetching and addition completed for userEmail ${userEmail}.`);
				} catch (error) {
					logger.error("Error in handler:", { userEmail, error: error.message, stack: error.stack });

					if (!res.headersSent) {
						const statusCode = error.http_status_code || error._response?.status || 500;
						res.status(statusCode).json({ success: false, message: error.message });
					}

					logger.error(`Failed to fetch data from Chargebee for userEmail ${userEmail}.`, {
						userEmail,
						error: error.message,
					});
				}
			},
		},
		"POST /raw/:listName": {
			enabled: false,
			handler: async function (req, res) {
				try {
					const body = req.body;
					const listName = req.params.listName;
					const result = await Chargebee.fetchData(body, listName);
					if (!result.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					if (error.http_status_code) {
						return res.status(error.http_status_code).json({ success: false, message: error.message });
					}
					return res.status(500).json({ success: false, message: error.message });
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
					Chargebee.fetchAndAddData({ user, onboardingDetails }).catch((fetchError) =>
						logger.error(`Error fetching data`, fetchError)
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
