const { logger } = require("utils");
module.exports.routes = function (props) {
	const {
		Services: { Thrivestack, WorkOS },
		config,
	} = props;
	return {
		"POST /thrivestack": {
			enabled: false,
			localMiddlewares: ["CheckContentType"],
			handler: async function (req, res) {
				try {
					let body = req.body;
					let isEmptyBody = Object.keys(body).length === 0;
					if (isEmptyBody) {
						logger.error("no data received in request body from thrivestack.");
						console.log("data in request body", req.body);
						return res
							.status(400)
							.json({ success: false, message: "no data received in request body from thrivestack." });
					}
					logger.info("data received in request body: ", body);
					logger.info("event type: ", body.eventType);
					res.status(200).json({ success: true, message: "Request received" });
					const serviceName = config.thrivestackEvents[body?.eventType];
					if (serviceName) {
						const result = await Thrivestack[serviceName](body);
						if (!result.success) {
							logger.error(result.message);
							return;
						}
						logger.info(result.message);
						return;
					} else {
						logger.warn(`service not found for event ${body?.eventType}`);
						return;
					}
				} catch (error) {
					logger.error("thrivestack webhook: something went wrong", error);
					return;
				}
			},
		},
		"POST /workOS": {
			localMiddlewares: ["CheckContentType"],
			handler: async function (req, res) {
				try {
					let body = req.body;
					let isEmptyBody = Object.keys(body).length === 0;
					if (isEmptyBody) {
						logger.error("no data received in request body from WorkOS.");
						console.log("data in request body", req.body);
						return res
							.status(400)
							.json({ success: false, message: "no data received in request body from WorkOS." });
					}
					logger.debug("data received in request body: ", body);
					logger.debug("event type: ", body.event);
					res.status(200).json({ success: true, message: "Request received" });
					const serviceName = config.workOSEvents[body?.event];
					if (serviceName) {
						const result = await WorkOS[serviceName](body);
						if (!result.success) {
							logger.error(result.message);
							return;
						}
						logger.info(result.message);
						return;
					} else {
						logger.warn(`service not found for event ${body?.eventType}`);
						return;
					}
				} catch (error) {
					logger.error("WorkOS webhook: something went wrong", error);
					return;
				}
			},
		},
		"POST /slack/events": {
			handler: async function (req, res) {
				try {
					let body = req.body;
					let isEmptyBody = Object.keys(body).length === 0;
					if (isEmptyBody) {
						logger.error("no data received in request body from slack.");
						return res
							.status(400)
							.json({ success: false, message: "no data received in request body from slack." });
					}
					const { token, challenge = "", type } = req.body;
					logger.info("data received in request body: ", req.body);
					return res.status(200).json({ challenge });
				} catch (error) {
					logger.error("slack events webhook: something went wrong", error);
					return res.status(500).json({ challenge });
				}
			},
		},
	};
};
