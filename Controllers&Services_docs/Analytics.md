const Joi = require("joi");
const mongoose = require("mongoose");

module.exports.routes = function (props) {
	const {
		Services: { Analytics },
	} = props;
	return {
		"GET /workflow": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					let { sortBy, sortOrder, pageNo, pageSize, filter, startTime, endTime } = req.query;
					pageNo = parseInt(pageNo);
					pageSize = parseInt(pageSize);
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validateAnalytics(
						{ sortBy, sortOrder, pageNo, pageSize, filter, startTime, endTime },
						"get"
					);
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Analytics.getWorkflow({
						company,
						sortBy,
						sortOrder,
						pageNo,
						pageSize,
						filter,
						startTime,
						endTime,
					});
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"GET /workflow/clientAnalytics/:workflowId": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					let filter = req.query?.filter || "%7B%7D";
					let { sortBy, sortOrder, startTime, endTime, pageNo, pageSize } = req.query;
					pageNo = parseInt(pageNo);
					pageSize = parseInt(pageSize);
					const workflowId = req.params.workflowId;
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validateAnalytics(
						{ workflowId, filter, sortBy, sortOrder, pageNo, pageSize },
						"clientWiseAnalytics"
					);
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Analytics.getClientWiseWorkflowAnalytics({
						filter,
						company,
						workflowId,
						sortBy,
						sortOrder,
						startTime,
						endTime,
						pageNo,
						pageSize,
					});
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"POST /export/workflow/clientAnalytics/:workflowId": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					let filter = req.query?.filter || "%7B%7D";
					const notificationIds = req.body.notificationIds;
					const { sortBy, sortOrder, pageNo, pageSize, startTime, endTime } = req.query;
					const workflowId = req.params.workflowId;
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validateAnalytics(
						{ workflowId, filter, sortBy, sortOrder },
						"clientWiseAnalytics"
					);
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Analytics.exportClientWiseWorkflowAnalytics({
						filter,
						company,
						workflowId,
						sortBy,
						sortOrder,
						startTime,
						endTime,
						pageNo,
						pageSize,
						notificationIds,
					});
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
	};
};

const validateAnalytics = (data, endpointName) => {
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
			filter: Joi.string().allow(null),
			sortBy: Joi.string().allow(null),
			sortOrder: Joi.string().allow(null),
			pageNo: Joi.number().allow(null),
			pageSize: Joi.number().allow(null),
			startTime: Joi.string().allow(null),
			endTime: Joi.string().allow(null),
		}),
		clientWiseAnalytics: Joi.object({
			workflowId: objectIdSchema,
			filter: Joi.string().allow(null),
			sortBy: Joi.string().allow(null),
			sortOrder: Joi.string().allow(null),
			pageNo: Joi.number().allow(null),
			pageSize: Joi.number().allow(null),
			startTime: Joi.string().allow(null),
			endTime: Joi.string().allow(null),
		}),
	};
	return schema[endpointName].validate(data);
};
