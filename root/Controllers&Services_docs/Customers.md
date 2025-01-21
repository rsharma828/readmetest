const Joi = require("joi");
const url = require("url");
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { Customers },
	} = props;
	return {
		"GET /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const { query: reqQuery, user, onboardingDetails } = req;

					const query = {
						filter: reqQuery.filter ? JSON.parse(decodeURI(reqQuery.filter)) : {},
						pageNo: Number(reqQuery.pageNo) || 1, // Default to 1 if not provided
						pageSize: Number(reqQuery.pageSize) || 10, // Default to 10 if not provided
						search: reqQuery.search,
						sortOrder: reqQuery.sortOrder,
						sortBy: reqQuery.sortBy,
					};

					const { error } = validate(query, "getCustomers");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}

					const result = await Customers.getCustomerData({ query, user, onboardingDetails });
					if (!result.success) {
						return res.status(400).json(result);
					}

					return res.status(200).json(result);
				} catch (error) {
					logger.error("Error processing customer data request:", { error: error.message });
					return res.status(500).json({ success: false, message: "Internal Server Error" });
				}
			},
		},
		"POST /export": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const user = req.user;
					const onboardingDetails = req.user.onboardingDetails;
					const selectedCustomers = req.body.selectedCustomers || [];
					if (selectedCustomers.length === 0) {
						return res.status(400).json({
							success: false,
							message: "No customer is selected export.",
						});
					}
					const result = await Customers.exportCustomersToCsv({ user, selectedCustomers, onboardingDetails });
					if (!result.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					return res.status(500).json({
						success: false,
						message: error.message,
					});
				}
			},
		},
		"PUT /assignPersona": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const user = req.user;
					const selectedCustomers = req.body.selectedCustomers;
					const { error } = validate(req.body, "assignPersona");
					if (error) return res.status(400).json({ success: false, error: error.details[0].message });
					const result = await Customers.assignPersona({ user, selectedCustomers });
					if (!result.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"PUT /assignCustomersToRetExp": {
			localMiddlewares: ["isLoggedIn", "isRetAdmin"],
			handler: async function (req, res) {
				try {
					const user = req.user;
					const customerIds = req.body.customerIds;
					const retExpertEmail = req.body.retExpertEmail;
					const { error } = validate(req.body, "assignCustomersToRetExp");
					if (error) return res.status(400).json({ success: false, error: error.details[0].message });
					const result = await Customers.assignCustomersToRetExp({ user, customerIds, retExpertEmail });
					if (!result.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"PUT /reassignCustomers": {
			localMiddlewares: ["isLoggedIn", "isRetAdmin"],
			handler: async function (req, res) {
				try {
					const user = req.user;
					const { error } = validate(req.body, "reassignCustomers");
					if (error) return res.status(400).json({ success: false, error: error.details[0].message });
					const result = await Customers.reassignCustomers({ user, body: req.body });
					if (!result.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"GET /productTier": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const { query, user } = req;
					const result = await Customers.getProductTier({ user, query });
					if (!result.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					logger.error("Error processing customer data request:", { error: error.message });
					return res
						.status(500)
						.json({ success: false, message: "Internal Server Error", stack: error.stack });
				}
			},
		},
	};
};

const validate = (data, endpointName) => {
	const schema = {
		getCustomers: Joi.object({
			filter: Joi.object(),
			pageNo: Joi.number(),
			pageSize: Joi.number(),
			search: Joi.string().allow(""),
			sortBy: Joi.string().allow(""),
			sortOrder: Joi.string().allow("asc", "desc"),
		}),
		assignPersona: Joi.object({
			selectedCustomers: Joi.array()
				.items(
					Joi.object({
						customerId: Joi.string().trim().required(),
						personaType: Joi.string().trim().required(), // persona type Id
						personaCategory: Joi.string().trim().required(), // persona category Id
					})
				)
				.min(1)
				.required(),
		}),
		assignCustomersToRetExp: Joi.object({
			customerIds: Joi.array().items(Joi.string().trim().required()).min(1).required(),
			retExpertEmail: Joi.string().trim().email().required(),
		}),
		reassignCustomers: Joi.object({
			retExpertEmail: Joi.string().trim().email().required(),
			assignTo: Joi.string().trim().email().required(),
		}),
	};
	return schema[endpointName].validate(data, { allowUnknown: true });
};
