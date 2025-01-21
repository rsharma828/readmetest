const Joi = require("joi");
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { Persona },
	} = props;
	return {
		"GET /categories": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const { user, onboardingDetails } = req;
					// const { error } = validate(query, "getCategories");
					// if (error) return res.status(400).json({ success: false, error: error.details[0].message });
					const result = await Persona.getCategories({ user, onboardingDetails });
					if (!result.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"GET /industryWise": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					let { filter, sortBy, sortOrder, projection } = req.query;
					filter = JSON.parse(decodeURI(filter));
					projection = req.query.projection && JSON.parse(req.query.projection);
					if (projection?.length > 0) {
						projection.forEach((key) => {
							projection[key] = 1;
						});
					}
					sortOrder = sortOrder === "desc" ? -1 : 1;

					const result = await Persona.getIndustryWisePersonas({ filter, sortBy, sortOrder, projection });
					if (!result.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"PUT /config/:_id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				// TODO: When this API is hit, we need to lock it until all the personas are
				// not mapped again.
				try {
					const { params, body } = req;
					const { error } = validate(params, "updatePersonaConfig");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}

					const result = await Persona.updatePersonaConfig({ body, params });
					return res.status(result.success ? 200 : 400).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"GET /industries": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const result = await Persona.getIndustries();
					if (!result.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
	};
};

const validate = (data, endpointName) => {
	const schema = {
		getCategories: Joi.object({
			// userId: Joi.string().required(),
			filter: Joi.object({
				personaType: Joi.string(),
				industryType: Joi.string(),
				isActive: Joi.boolean(),
				category: Joi.string(),
				description: Joi.array().items(Joi.string()),
			}),
			search: Joi.string(),
			sortBy: Joi.string(),
			sortOrder: Joi.string().allow("asc", "desc"),
		}),
		getIndustryWisePersonas: Joi.object({
			filter: Joi.object({
				personaType: Joi.string(),
				industryType: Joi.string(),
				isActive: Joi.boolean(),
				category: Joi.string(),
				description: Joi.array().items(Joi.string()),
			}),
			search: Joi.string(),
			sortBy: Joi.string(),
			sortOrder: Joi.string().allow("asc", "desc"),
		}),
		updatePersonaConfig: Joi.object({
			_id: Joi.string().length(24).hex().required(),
		}),
	};
	return schema[endpointName].validate(data, { allowUnknown: true });
};
