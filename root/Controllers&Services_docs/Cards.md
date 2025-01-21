const Joi = require("joi");
const mongoose = require("mongoose");
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { Cards },
	} = props;

	return {
		"GET /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const pageNo = Number(req.query.pageNo) || 1;
					const pageSize = Number(req.query.pageSize) || 10;
					const filter = JSON.parse(decodeURI(req.query?.filter || "%7B%7D"));
					const sortBy = req.query?.sortBy !== "" ? req.query?.sortBy : "label";
					const sortOrder = req.query?.sortOrder;
					const { error } = validate({ filter, sortOrder, sortBy, pageNo, pageSize }, "get");
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
		"GET /:_id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const _id = req.params._id;
					const { error } = validate({ _id }, "getOne");
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
					const result = await Cards.create(body);
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
					const result = await Cards.updateOne({ _id }, body, { new: true });
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
					const { error } = validate({ _id }, "getOne");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Cards.findByIdAndRemove({ _id: new mongoose.Types.ObjectId(_id) });
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
			localMiddlewares: ["isLoggedIn"],
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
		"POST /duplicate/:cardId": {
			localMiddlewares: ["isLoggedIn", "isKaleAdmin"],
			handler: async function (req, res) {
				try {
					let { parentCardId, templateId, parentBranchId } = req.query;
					parentCardId = parentCardId === "null" ? null : parentCardId;
					const cardId = req.params.cardId;
					const { error } = validate({ _id: cardId }, "getOne");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Cards.duplicateCard({
						cardId,
						parentId: parentCardId,
						templateId,
						parentBranchId,
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
	const objectIdSchema = Joi.string()
		.allow(null)
		.custom((value, helpers) => {
			if (!mongoose.Types.ObjectId.isValid(value)) {
				return helpers.message("Invalid ObjectId in parameters");
			}
			return value;
		}, "ObjectId Validation");
	const schema = {
		get: Joi.object({
			filter: Joi.object(),
			sortOrder: Joi.string(),
			sortBy: Joi.string(),
			pageNo: Joi.number(),
			pageSize: Joi.number(),
		}),
		getOne: Joi.object({
			_id: objectIdSchema.required(),
		}),
		create: Joi.object({
			label: Joi.string().required(),
			videoId: Joi.object().allow(null),
			imageUrl: Joi.object().allow(null),
			cardThumbnailUrl: Joi.string().allow(""),
			videoThumbnailUrl: Joi.string().allow(""),
			templateId: objectIdSchema.required(),
			parentId: objectIdSchema.required().allow(null),
			parentBranchId: Joi.string().allow(null, ""),
		}),
		update: Joi.object({
			_id: objectIdSchema.required(),
			label: Joi.string(),
			videoId: Joi.object().allow(null),
			imageUrl: Joi.object().allow(null),
			cardThumbnailUrl: Joi.string().allow(""),
			videoThumbnailUrl: Joi.string().allow(""),
			templateId: objectIdSchema,
			parentId: objectIdSchema.allow(null),
			parentBranchId: Joi.string().allow(null, ""),
		}),
	};
	return schema[endpointName].validate(data);
};
