const Joi = require("joi");

module.exports.routes = function (props) {
	const {
		Services: { UserSession },
	} = props;
	return {
		"GET /": {
			handler: async function (req, res) {
				try {
					const { error } = validate(req.query, "request");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const { companyId, userEmail } = req.query;
					const result = await UserSession.getSession({ companyId, userEmail });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"POST /": {
			handler: async function (req, res) {
				try {
					const { error } = validate(req.query, "request");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const { companyId, userEmail } = req.query;
					const result = await UserSession.createSession({ companyId, userEmail });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"DELETE /": {
			handler: async function (req, res) {
				try {
					const { error } = validate(req.query, "request");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const { companyId, userEmail } = req.query;
					const result = await UserSession.endSession({ companyId, userEmail });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
	};
};

const validate = (data, endpointName) => {
	const schema = {
		request: Joi.object({
			userEmail: Joi.string().email().required(),
			companyId: Joi.string().required(),
		}),
	};
	return schema[endpointName].validate(data);
};
