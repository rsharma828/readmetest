const Joi = require("joi");
const mongoose = require("mongoose");
const { CompaniesModel } = require("models/Companies");
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { Workflow, Customers, EmailSender },
	} = props;
	return {
		"GET /": {
			handler: async function (req, res) {
				try {
					const { companyId } = req.query;
					const company = await CompaniesModel.findOne({ _id: companyId });
					if (!company) {
						return {
							success: false,
							message: `Company not found for id ${companyId}`,
						};
					}
					const filter = req.query.filter ? JSON.parse(decodeURI(req.query.filter)) : {};
					const projection = req.query.projection ? JSON.parse(decodeURI(req.query.projection)) : {};
					const sortBy = req.query.sortBy || "_id";
					const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
					const sort = { [sortBy]: sortOrder };
					const pageNo = req.query.pageNo || 1;
					const pageSize = req.query.pageSize || 10;
					const { error } = validate({ filter, projection, sort, pageNo, pageSize }, "get");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.get({ company, filter, projection, sort });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"GET /:id": {
			handler: async function (req, res) {
				try {
					const { companyId } = req.query;
					const company = await CompaniesModel.findOne({ _id: companyId });
					if (!company) {
						return {
							success: false,
							message: `Company not found for id ${companyId}`,
						};
					}
					const { error } = validate(req.params.id, "getOne");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const id = req.params.id;
					const result = await Workflow.getOne({ company, id });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"GET /cards/flow/:workflowId": {
			handler: async function (req, res) {
				try {
					const { companyId } = req.query;
					const company = await CompaniesModel.findOne({ _id: companyId });
					if (!company) {
						return {
							success: false,
							message: `Company not found for id ${companyId}`,
						};
					}
					const { error } = validate(req.params.workflowId, "getOne");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const workflowId = req.params.workflowId;
					const result = await Workflow.getFlow({ company, workflowId });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"GET /cards/:cardId": {
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validate(req.params.cardId, "getOne");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const cardId = req.params.cardId;
					const result = await Workflow.getFlow({ company, cardId });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"GET /cardElements/:elementId": {
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validate(req.params.elementId, "getOne");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const elementId = req.params.elementId;
					const result = await Workflow.getCardElement({ company, elementId });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"GET /customer/Info": {
			handler: async function (req, res) {
				try {
					const { companyId, userEmail } = req.query;
					const { error } = validate({ companyId, userEmail }, "getCustomerInfo");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await Customers.getCustomerInfo({ companyId, userEmail });
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
		"POST /sendOfferCode": {
			handler: async function (req, res) {
				try {
					const { offerCode, offerDescription } = req.body;
					const { userEmail } = req.query;
					const { error } = validate({ userEmail, offerCode, offerDescription }, "sendOfferCode");
					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`);
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}
					const result = await EmailSender.sendOfferCode({ userEmail, offerCode, offerDescription });
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
				templateId: objectIdSchema,
				personas: Joi.array().items(Joi.string()),
				customerIds: Joi.array().items(objectIdSchema),
				userEmails: Joi.array().items(Joi.string()),
				status: Joi.string().valid("ACTIVE", "DRAFT", "INACTIVE"),
				deactivatedDate: Joi.date(),
				flowType: Joi.string().valid("CANCELLATION", "ENGAGEMENT"),
				isScheduled: Joi.boolean(),
				scheduledOn: Joi.date().iso(),
				allowSnooze: Joi.boolean(),
				snoozeTime: Joi.number(),
				allowMinimize: Joi.boolean(),
				allowIgnore: Joi.boolean(),
				validity: Joi.number(),
				deliveryChannel: Joi.string().valid("IN_APP", "EMAIL"),
			}),
			projection: Joi.object(),
			sort: Joi.object(),
			pageNo: Joi.number(),
			pageSize: Joi.number(),
		}),
		getOne: objectIdSchema,
		getCustomerInfo: Joi.object({
			companyId: objectIdSchema.required(),
			userEmail: Joi.string().email().required(),
		}),
		sendOfferCode: Joi.object({
			userEmail: Joi.string().email().required(),
			offerCode: Joi.string().required(),
			offerDescription: Joi.string().required(),
		}),
	};
	return schema[endpointName].validate(data);
};
