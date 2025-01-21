const Joi = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { Template, Customers, Cards },
		config,
	} = props;

	return {
		"GET /template": {
			localMiddlewares: [],
			handler: async function (req, res) {
				try {
					const pageNo = Number(req.query.pageNo) || 1;
					const pageSize = Number(req.query.pageSize) || 10;
					let filter = JSON.parse(decodeURI(req.query?.filter || "%7B%7D"));
					const sortBy = req.query?.sortBy !== "" ? req.query?.sortBy : "templateName";
					const sortOrder = req.query?.sortOrder;
					const { error } = validate({ filter, sortOrder, sortBy, pageNo, pageSize }, "getTemplate");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Template.paginationFind({ filter, sortOrder, sortBy, pageNo, pageSize });
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
		"GET /template/:_id": {
			localMiddlewares: [],
			handler: async function (req, res) {
				try {
					const _id = req.params._id;
					const { error } = validate({ _id }, "getOneTemplate");
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
		"GET /cards": {
			localMiddlewares: [],
			handler: async function (req, res) {
				try {
					const pageNo = Number(req.query.pageNo) || 1;
					const pageSize = Number(req.query.pageSize) || 10;
					const filter = JSON.parse(decodeURI(req.query?.filter || "%7B%7D"));
					const sortBy = req.query?.sortBy !== "" ? req.query?.sortBy : "label";
					const sortOrder = req.query?.sortOrder;
					const { error } = validate({ filter, sortOrder, sortBy, pageNo, pageSize }, "getCards");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Cards.paginationFind({ filter, sortOrder, sortBy, pageNo, pageSize });
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
		"GET /cards/:_id": {
			localMiddlewares: [],
			handler: async function (req, res) {
				try {
					const _id = req.params._id;
					const { error } = validate({ _id }, "getOneCard");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Cards.findOne({ _id });
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
		"GET /cardTree/:templateId": {
			localMiddlewares: [],
			handler: async function (req, res) {
				try {
					const templateId = req.params.templateId;
					const { error } = validate({ _id: templateId }, "getOneCard");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Cards.getWorkflow({ templateId });
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
		getTemplate: Joi.object({
			filter: Joi.object({
				templateName: Joi.string(),
				status: Joi.string(),
				clientUsage: Joi.number(),
				sessionUsage: Joi.number(),
				successRate: Joi.number(),
				mrrSaved: Joi.number(),
				personaMapped: Joi.string(),
				engagementType: Joi.string().valid("ONBOARDING", "ADOPTION", "ADVOCACY"),
			}),
			sortOrder: Joi.string(),
			sortBy: Joi.string(),
			pageNo: Joi.number(),
			pageSize: Joi.number(),
		}),
		getOneTemplate: Joi.object({
			_id: objectIdSchema.required(),
		}),
		getCards: Joi.object({
			filter: Joi.object({
				label: Joi.string(),
				videoId: objectIdSchema,
				templateId: objectIdSchema,
				parentId: objectIdSchema,
			}),
			sortOrder: Joi.string(),
			sortBy: Joi.string(),
			pageNo: Joi.number(),
			pageSize: Joi.number(),
		}),
		getOneCard: Joi.object({
			_id: objectIdSchema.required(),
		}),
	};
	return schema[endpointName].validate(data);
};
