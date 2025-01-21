const Joi = require("joi");

module.exports.routes = function (props) {
	const {
		Services: { Slack },
	} = props;
	return {
		"POST /connect": {
			handler: async function (req, res) {
				try {
					const body = req.body;
					const { error } = validate(body, "connect");
					if (error) return res.status(400).json({ success: false, error: error.details[0].message });
					const connected = await Slack.connect(body);
					if (!connected.success) {
						return res.status(400).json(connected);
					}
					return res.status(200).json(connected);
				} catch (error) {
					if (error.http_status_code) {
						return res.status(error.http_status_code).json({ success: false, message: error.message });
					}
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"POST /handleCallback": {
			handler: async function (req, res) {
				try {
					const body = req.body;
					const { error } = validate(body, "handleCallback");
					if (error) return res.status(400).json({ success: false, error: error.details[0].message });
					const connected = await Slack.handleOauthCallback(body);
					if (!connected.success) {
						return res.status(400).json(connected);
					}
					return res.status(200).json(connected);
				} catch (error) {
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
			userId: Joi.string().required(),
			clientId: Joi.string().required(),
			clientSecret: Joi.string().required(),
		}),
		handleCallback: Joi.object({
			userId: Joi.string().required(),
			code: Joi.string().required(),
			state: Joi.string().required(),
		}),
	};
	return schema[endpointName].validate(data);
};
