const Joi = require("joi");
const { logger } = require("utils");
module.exports.routes = function (props) {
	const {
		Services: { WorkOS },
		config: { CONSTANTS, loginUrl },
	} = props;
	return {
		"GET /token": {
			handler: async function (req, res) {
				try {
					const query = req.query;
					const { error } = validate(query, "getToken");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await WorkOS.getTokenFromCode(query);
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					logger.error(error);
					const statusCode = error.status ? error.status : 500;
					return res.status(statusCode).json({
						success: false,
						message: error.message || "Internal Server Error.",
						stack: statusCode === 500 ? error.stack : null,
					});
				}
			},
		},
		"GET /token/refresh": {
			handler: async function (req, res) {
				try {
					const query = req.query;
					const { error } = validate(query, "tokenRefresh");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await WorkOS.getTokenFromRefreshToken(query);
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					logger.error(error);
					const statusCode = error.status ? error.status : 500;
					return res.status(statusCode).json({
						success: false,
						message: error.message || "Internal Server Error.",
						stack: statusCode === 500 ? error.stack : null,
					});
				}
			},
		},
		"GET /loginUrl": {
			handler: async function (req, res) {
				if (!loginUrl) {
					return res.status(400).json({
						success: false,
						message: "Signup url not found",
					});
				}
				return res.status(200).json({
					success: true,
					message: "Signup url fetched successfully",
					loginUrl,
				});
			},
		},
	};
};

const validate = (data, endpointName) => {
	const schema = {
		inviteUser: Joi.object({
			email: Joi.string().email().required(),
			role: Joi.string().valid("retentionAdmin", "retentionExpert").required(),
		}),
		getToken: Joi.object({
			code: Joi.string().required(),
		}),
		tokenRefresh: Joi.object({
			refreshToken: Joi.string().required(),
		}),
	};
	return schema[endpointName].validate(data);
};
