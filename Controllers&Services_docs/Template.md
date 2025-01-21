const Joi = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { Template },
		config,
	} = props;

	return {
		"GET /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const pageNo = Number(req.query.pageNo) || 1;
					const pageSize = Number(req.query.pageSize) || 10;
					let filter = JSON.parse(decodeURI(req.query?.filter || "%7B%7D"));
					const sortBy = req.query?.sortBy !== "" ? req.query?.sortBy : "createdAt";
					const sortOrder = req.query?.sortOrder;
					const search = req.query?.search;
					const { error } = validate({ filter, sortOrder, sortBy, pageNo, pageSize, search }, "get");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Template.paginationFind({
						filter,
						sortOrder,
						sortBy,
						pageNo,
						pageSize,
						search,
					});
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({
						success: false,
						message: error.message,
						stack: error.stack,
					});
				}
			},
		},
		"GET /:_id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const _id = req.params._id;
					const { flowType } = req.query;
					const { error } = validate({ _id, flowType }, "getOne");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Template.findOne({ _id });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({
						success: false,
						message: error.message,
						stack: error.stack,
					});
				}
			},
		},
		"POST /": {
			localMiddlewares: ["isLoggedIn", "isKaleAdmin"],
			handler: async function (req, res) {
				try {
					const body = req.body;
					const { error } = validate(body, "create");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Template.create({ object: body, userId: req.user._id });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({
						success: false,
						message: error.message,
						stack: error.stack,
					});
				}
			},
		},
		"POST /duplicate/:templateId": {
			localMiddlewares: ["isLoggedIn", "isKaleAdmin"],
			handler: async function (req, res) {
				try {
					const templateId = req.params.templateId;
					const { error } = validate({ _id: templateId }, "getOne");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Template.duplicate({ templateId, user: req.user });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({
						success: false,
						message: error.message,
						stack: error.stack,
					});
				}
			},
		},
		"PUT /:_id": {
			localMiddlewares: ["isLoggedIn", "isKaleAdmin"],
			handler: async function (req, res) {
				try {
					const _id = req.params._id;
					const body = req.body;
					const { error } = validate({ _id, ...body }, "update");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Template.updateOne({ _id }, body, { new: true });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({
						success: false,
						message: error.message,
						stack: error.stack,
					});
				}
			},
		},
		"DELETE /:_id": {
			localMiddlewares: ["isLoggedIn", "isKaleAdmin"],
			handler: async function (req, res) {
				try {
					const _id = req.params._id;
					const { flowType } = req.query;
					const { error } = validate({ _id, flowType }, "getOne");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Template.findByIdAndRemove({ _id });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({
						success: false,
						message: error.message,
						stack: error.stack,
					});
				}
			},
		},
		"GET /analytics/:templateId": {
			localMiddlewares: ["isLoggedIn", "isKaleAdmin"],
			handler: async function (req, res) {
				try {
					const templateId = req.params.templateId;
					const { search, sortBy, sortOrder, pageNo, pageSize, startTime, endTime } = req.query;
					const { error } = validate({ templateId, ...req.query }, "analytics");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Template.getTemplateWiseAnalytics({
						templateId,
						pageNo,
						pageSize,
						search,
						sortBy,
						sortOrder,
						startTime,
						endTime,
					});
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({
						success: false,
						message: error.message,
						stack: error.stack,
					});
				}
			},
		},
		"GET /clientWise/:clientName": {
			localMiddlewares: ["isLoggedIn", "isKaleAdmin"],
			handler: async function (req, res) {
				try {
					const clientName = req.params.clientName;
					const { sortOrder, sortBy, pageNo, pageSize, filter, startTime, endTime } = req.query;
					const { error } = validate({ clientName, sortBy, sortOrder }, "clientWiseAnalytics");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Template.getClientWiseAnalytics({
						clientName,
						sortOrder,
						sortBy,
						pageNo,
						pageSize,
						startTime,
						endTime,
					});
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					logger.error(error);
					return res.status(500).json({
						success: false,
						message: error.message,
						stack: error.stack,
					});
				}
			},
		},
	};
};

const validate = (data, endpointName) => {
	const objectIdSchema = Joi.string().custom((value, helpers) => {
		if (!mongoose.Types.ObjectId.isValid(value)) {
			return helpers.message("Invalid ObjectId in parameters");
		}
		return value;
	}, "ObjectId Validation");
	const schema = {
		get: Joi.object({
			filter: Joi.object({
				templateName: Joi.string(),
				status: Joi.string(),
				clientUsage: Joi.number(),
				sessionUsage: Joi.number(),
				openRate: Joi.number(),
				successRate: Joi.number(),
				mrrSaved: Joi.number(),
				personaMapped: Joi.string(),
				flowType: Joi.string(),
				engagementType: Joi.string().valid("ONBOARDING", "ADOPTION", "ADVOCACY"),
			}),
			sortOrder: Joi.string().allow(""),
			sortBy: Joi.string().allow(""),
			pageNo: Joi.number(),
			pageSize: Joi.number(),
			search: Joi.string().allow(""),
		}),
		getOne: Joi.object({
			_id: objectIdSchema.required(),
			flowType: Joi.string(),
		}),
		create: Joi.object({
			templateName: Joi.string().required().max(32),
			thumbnailUrl: Joi.string().allow(""),
			description: Joi.string().allow("", null),
			status: Joi.string().valid("ACTIVE", "DRAFT").required(),
			personaMapped: Joi.array().items(Joi.string()),
			flowType: Joi.string().valid("CANCELLATION", "ENGAGEMENT").required(),
			engagementType: Joi.array().items(Joi.string().valid("ONBOARDING", "ADOPTION", "ADVOCACY").allow("", null)),
		}),
		update: Joi.object({
			_id: objectIdSchema.required(),
			templateName: Joi.string().max(32),
			description: Joi.string().allow("", null),
			thumbnailUrl: Joi.string().allow(""),
			status: Joi.string().valid("ACTIVE", "DRAFT", "INACTIVE"),
			personaMapped: Joi.array().items(Joi.string()),
			flowType: Joi.string().valid("CANCELLATION", "ENGAGEMENT"),
			engagementType: Joi.array().items(Joi.string().valid("ONBOARDING", "ADOPTION", "ADVOCACY").allow("", null)),
		}),
		analytics: Joi.object({
			templateId: objectIdSchema.required(),
			search: Joi.string().allow("", null),
			sortOrder: Joi.string().valid("asc", "desc").allow("", null),
			sortBy: Joi.string().allow("", null),
			pageNo: Joi.number().allow("", null),
			pageSize: Joi.number().allow("", null),
			startTime: Joi.string().allow(null, ""),
			endTime: Joi.string().allow(null, ""),
		}),
		clientWiseAnalytics: Joi.object({
			clientName: Joi.string().required(),
			sortOrder: Joi.string(),
			sortBy: Joi.string().valid("workflowCount", "clientUsage", "openRate", "successRate", "templateName"),
			pageNo: Joi.number().allow("", null),
			pageSize: Joi.number().allow("", null),
			startTime: Joi.string().allow(null, ""),
			endTime: Joi.string().allow(null, ""),
		}),
	};
	return schema[endpointName].validate(data);
};
