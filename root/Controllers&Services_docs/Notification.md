const { response } = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { Notification },
		config,
	} = props;

	return {
		"GET /:userEmail": {
			handler: async function (req, res) {
				try {
					const companyId = req.query.companyId;
					const userEmail = req.params.userEmail;
					let { filter, sortBy, sortOrder } = req.query || null;
					filter = filter ? JSON.parse(filter) : null;
					const { error } = validate({ companyId, userEmail, filter, sortBy, sortOrder }, "get");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Notification.find({ companyId, userEmail, filter, sortBy, sortOrder });
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
		"POST /:userEmail": {
			handler: async function (req, res) {
				try {
					const companyId = req.query.companyId;
					const userEmail = req.params.userEmail;
					const { error } = validate({ companyId, userEmail }, "insert");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Notification.insertMany({ companyId, userEmail });
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
		"PUT /:notificationId": {
			handler: async function (req, res) {
				try {
					const companyId = req.query.companyId;
					const notificationId = req.params.notificationId;
					const { status, userEmail } = req.query;
					const response = req.body || [];
					const { error } = validate({ companyId, notificationId, status, response }, "update");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Notification.update({
						companyId,
						userEmail,
						notificationId,
						status,
						response,
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
			userEmail: Joi.string().email().required(),
			companyId: objectIdSchema.required(),
			filter: Joi.object({
				status: Joi.string().valid("IGNORED", "SNOOZED", "COMPLETED", "UNSEEN", "IN_PROGRESS"),
			}).allow(null),
			sortBy: Joi.string().allow(null, ""),
			sortOrder: Joi.string().valid("asc", "desc").allow(null, ""),
		}),
		insert: Joi.object({
			userEmail: Joi.string().email().required(),
			companyId: objectIdSchema.required(),
			response: Joi.object().allow(null),
		}),
		update: Joi.object({
			companyId: objectIdSchema.required(),
			notificationId: objectIdSchema.required(),
			status: Joi.string().valid("IGNORED", "SNOOZED", "COMPLETED", "UNSEEN", "IN_PROGRESS").required(),
			response: Joi.object().allow(null),
		}),
	};
	return schema[endpointName].validate(data);
};
