const Joi = require("joi");
const mongoose = require("mongoose");

module.exports.routes = function (props) {
	const {
		Services: { UserEvents },
	} = props;
	return {
		"GET /": {
			handler: async function (req, res) {
				try {
					const { error } = validate(req.query, "get");
					if (error) {
						return res.status(400).json({ success: false, error: error.stack });
					}
					const { companyId, userEmail, filter } = req.query;
					const result = await UserEvents.find({ companyId, userEmail, filter });
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
					const { error: bodyError } = validate(req.body, "add");
					if (bodyError) {
						return res.status(400).json({ success: false, error: `body:${bodyError.stack}` });
					}
					const { error: queryError } = validate(req.query, "get");
					if (queryError) {
						return res.status(400).json({ success: false, error: `query:${queryError.stack}` });
					}
					const event = req.body;
					const { companyId, userEmail } = req.query;
					const result = await UserEvents.create({ companyId, userEmail, event });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"POST /addMultiple": {
			handler: async function (req, res) {
				try {
					const { error: bodyError } = validate(req.body, "addMultiple");
					if (bodyError) {
						return res.status(400).json({ success: false, error: `body:${bodyError.stack}` });
					}
					const { error: queryError } = validate(req.query, "get");
					if (queryError) {
						return res.status(400).json({ success: false, error: `query:${queryError.stack}` });
					}
					const events = req.body;
					const { companyId, userEmail } = req.query;
					const result = await UserEvents.insertMany({ companyId, userEmail, events });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"PUT /:_id": {
			handler: async function (req, res) {
				try {
					const _id = req.params._id;
					if (!_id) {
						return res.status(400).json({
							success: false,
							message: "Event id not provided.",
						});
					}
					const { userEmail, companyId } = req.query;
					const events = req.body;
					if (!companyId) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error: bodyError } = validate(req.body, "add");
					if (bodyError) {
						return res.status(400).json({ success: false, error: `body:${bodyError.stack}` });
					}
					const { error: queryError } = validate(req.query, "get");
					if (queryError) {
						return res.status(400).json({ success: false, error: `query:${queryError.stack}` });
					}
					const result = await UserEvents.update({ _id, companyId, userEmail, events });
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
	const objectIdSchema = Joi.string().custom((value, helpers) => {
		if (!mongoose.Types.ObjectId.isValid(value)) {
			return helpers.message("Invalid ObjectId in parameters");
		}
		return value;
	}, "ObjectId Validation");
	const schema = {
		get: Joi.object({
			userEmail: Joi.string().email().required(),
			companyId: Joi.string().required(),
		}),
		add: Joi.object({
			eventName: Joi.string().required(),
			eventType: Joi.string().required(),
			eventData: Joi.object({
				workflowId: objectIdSchema,
				cardId: objectIdSchema,
				cardElementId: objectIdSchema,
				responseType: Joi.string(),
				response: Joi.object({
					question: Joi.string(),
					answer: Joi.string(),
				}),
			}),
		}),
		addMultiple: Joi.array().items(
			Joi.object({
				eventName: Joi.string().required(),
				eventType: Joi.string().required(),
				eventData: Joi.object({
					workflowId: objectIdSchema,
					cardId: objectIdSchema,
					cardElementId: objectIdSchema,
					responseType: Joi.string(),
					response: Joi.object({
						question: Joi.string(),
						answer: Joi.string(),
					}),
				}),
			})
		),
	};
	return schema[endpointName].validate(data);
};
