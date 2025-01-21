const Joi = require("joi");
const mongoose = require("mongoose");
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { CardElements },
	} = props;

	return {
		"GET /": {
			localMiddlewares: ["isLoggedIn", "isKaleOrRetAdmin"],
			handler: async function (req, res) {
				try {
					const filter = JSON.parse(decodeURI(req.query?.filter || "%7B%7D"));
					const sortBy = req.query?.sortBy !== "" ? req.query?.sortBy : "index";
					const sortOrder = req.query?.sortOrder;
					const { error } = validate({ filter, sortOrder, sortBy }, "get");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await CardElements.find({ filter, sortOrder, sortBy });
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
			localMiddlewares: ["isLoggedIn", "isKaleOrRetAdmin"],
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
					const result = await CardElements.create(body);
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
		"PUT /:cardId": {
			localMiddlewares: ["isLoggedIn", "isKaleOrRetAdmin"],
			handler: async function (req, res) {
				try {
					const cardId = req.params.cardId;
					const body = req.body;
					const { error } = validate({ cardId, ...body }, "update");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await CardElements.update({ cardId }, body, { new: true });
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
		"DELETE /:cardElementId": {
			localMiddlewares: ["isLoggedIn", "isKaleOrRetAdmin"],
			handler: async function (req, res) {
				try {
					const cardElementId = req.params.cardElementId;
					const { error } = validate({ cardElementId }, "delete");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await CardElements.findByIdAndRemove({ cardElementId });
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
	const elementSchema = Joi.object({
		index: Joi.number().required(),
		meta: Joi.object().required(),
	});
	const schema = {
		get: Joi.object({
			filter: Joi.object({
				index: Joi.string(),
				cardId: objectIdSchema.required(),
				meta: Joi.object(),
			}),
			sortOrder: Joi.string(),
			sortBy: Joi.string(),
		}),
		delete: Joi.object({
			cardElementId: objectIdSchema.required(),
		}),
		create: Joi.object({
			cardId: objectIdSchema.required(),
			elements: Joi.array().items(elementSchema),
		}),
		update: Joi.object({
			cardId: objectIdSchema.required(),
			elements: Joi.array().items(elementSchema),
		}),
	};
	return schema[endpointName].validate(data);
};
