const Joi = require("joi");
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { Questionnaire, Companies },
	} = props;
	return {
		"GET /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const { user } = req;
					const userEmail = user.emailId;
					const { error } = validate({ userEmail }, "get");

					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`, { userEmail });
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}

					const userEmailDomain = userEmail.includes("@") ? userEmail.split("@")[1] : null;

					if (!userEmailDomain) {
						logger.error("Invalid email format:", { userEmail });
						return { success: false, message: "Invalid email format" };
					}

					const company = await Companies.findOne({ companyRegisteredDomain: userEmailDomain });

					if (!company) {
						return res.status(404).json({ success: false, message: "Company not found." });
					}

					const data = await Questionnaire.findOne({ companyId: company._id });

					if (!data) {
						return res.status(404).json({ success: false, message: "Company not found." });
					}
					return res.status(200).json({ success: true, data });
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"POST /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const { body, user } = req;
					body.userEmail = user.emailId;

					const { error } = validate(body, "add");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}

					const createResult = await Questionnaire.create(body);
					if (!createResult.success) {
						return res.status(400).json({ success: false, message: createResult.message });
					}

					return res
						.status(200)
						.json({ success: true, message: createResult.message, result: createResult.result });
				} catch (error) {
					if (error.code === 11000) {
						return res.status(400).json({
							success: false,
							message: "Questionnaire data already exists with the same company ID.",
						});
					}

					logger.error("Error in handler:", { error: error.message });
					return res.status(500).json({ success: false, message: "Internal Server Error" });
				}
			},
		},
		"PUT /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const body = req.body;
					const { error } = validate(body, "update");
					if (error) return res.status(400).json({ success: false, error: error.details[0].message });

					const { success, message, result } = await Questionnaire.updateOne(body);
					if (!success) {
						return res.status(400).json({ success, message });
					}
					return res.status(200).json({ success, message, result });
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
	};
};

const validate = (data, endpointName) => {
	const schema = {
		add: Joi.object({
			userEmail: Joi.string().email().required(),
			teamSize: Joi.number().required(),
			perMonthCancelSession: Joi.number().required(),
			challenges: Joi.array()
				.items(Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)))
				.required(),
		}),
		update: Joi.object({
			userEmail: Joi.string().email().required(),
			teamSize: Joi.number().required(),
			perMonthCancelSession: Joi.number().required(),
			challenges: Joi.array()
				.items(Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)))
				.required(),
		}),
		get: Joi.object({
			userEmail: Joi.string().email().required(),
		}),
	};
	return schema[endpointName].validate(data);
};
