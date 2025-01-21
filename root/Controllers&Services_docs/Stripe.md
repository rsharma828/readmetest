const { v4: uuidv4 } = require("uuid");
const { logger } = require("utils");
const Joi = require("joi");

module.exports.routes = function (props) {
	const {
		Services: { Stripe },
	} = props;
	return {
		"POST /connect": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				const { body, user, onboardingDetails } = req;
				const userEmail = user.emailId;
				try {
					const connected = await Stripe.connect({ body, user });
					if (!connected.success) {
						return res.status(400).json(connected);
					}

					res.status(200).json(connected);

					logger.info(`Data fetching has started from stripe for userEmail ${userEmail}.`);
					Stripe.fetchAndAddData({ user, onboardingDetails });
					return;
				} catch (error) {
					logger.error(error);
					if (!res.headersSent && error.http_status_code) {
						return res.status(error.http_status_code).json({ success: false, message: error.message });
					}
					if (!res.headersSent) {
						return res.status(500).json({ success: false, message: error.message });
					}
					logger.error(
						`failed to fetch data from stripe for userEmail ${userEmail}. `,
						`error message: ${error.message}`
					);
					return;
				}
			},
		},
		"POST /raw/:listName": {
			enabled: false,
			handler: async function (req, res) {
				try {
					const body = req.body;
					const listName = req.params.listName;
					const result = await Stripe.fetchData(body, listName);
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
					Stripe.fetchAndAddData({ user, onboardingDetails }).catch((fetchError) =>
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
