const Joi = require("joi");
const mongoose = require("mongoose");

module.exports.routes = function (props) {
	const {
		Services: { Workflow },
	} = props;
	return {
		"GET /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					const user = req.user;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const filter = req.query.filter ? JSON.parse(decodeURI(req.query.filter)) : {};
					const projection = req.query.projection ? JSON.parse(decodeURI(req.query.projection)) : {};
					const sortBy = req.query.sortBy || "_id";
					const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
					const sort = { [sortBy]: sortOrder };
					const pageNo = req.query.pageNo || 1;
					const pageSize = req.query.pageSize || 10;
					const startTime = req.query.startTime || "1970-01-01T00:00:00.000Z";
					const endTime = req.query.endTime || new Date().toISOString();
					const { error } = validate(
						{ filter, projection, sort, pageNo, pageSize, startTime, endTime },
						"get"
					);
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.get({
						company,
						filter,
						projection,
						sort,
						pageNo,
						pageSize,
						startTime,
						endTime,
						user,
					});
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"GET /:id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
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
		"POST /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					const userName = `${req.user.firstName} ${req.user.lastName}`;
					const workflow = req.body;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validate(workflow, "create");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.create({ company, workflow, userId: req.user._id, userName });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					if (error.code === 11000) {
						return res
							.status(400)
							.json({ success: false, message: "Session already started for same email." });
					}
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"PUT /:id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					const workflow = req.body;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					if (
						workflow.step === "NOTIFICATION_SETTING" &&
						workflow.deliveryChannel === "IN_APP" &&
						!(
							workflow.hasOwnProperty("personas") ||
							workflow.hasOwnProperty("customerIds") ||
							workflow.hasOwnProperty("userEmails")
						)
					) {
						return res.status(400).json({
							success: false,
							error: "One of these property not exist. Personas, Account Ids, User Emails",
						});
					}
					const { error } = validate({ ...req.body, id: req.params.id }, "update");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const id = req.params.id;
					const result = await Workflow.update({
						company,
						id,
						workflow,
						userId: req.user._id,
						userName: req.user.emailId,
					});
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"POST /copyEmail/:id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					const workflow = req.body;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validate({ ...req.body, id: req.params.id }, "copyEmail");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const id = req.params.id;
					const result = await Workflow.copyEmail({
						company,
						id,
						workflow,
						userId: req.user._id,
					});
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"PUT /deactivate/:id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const id = req.params.id;
					const { error } = validate(req.params.id, "getOne");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.deactivate({ company, id });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"POST /duplicate/:workflowId": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const workflowId = req.params.workflowId;
					const { error } = validate(req.params.workflowId, "getOne");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.duplicate({ company, workflowId, userId: req.user.id });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"POST /duplicateCard/:cardId": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const cardId = req.params.cardId;
					const { error } = validate(cardId, "getOne");
					const { parentCardId, templateId, parentBranchId } = req.query;
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.duplicateCard({
						company,
						cardId,
						userId: req.user.id,
						parentCardId,
						templateId,
						parentBranchId,
					});
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"GET /cards/flow/:workflowId": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
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
			localMiddlewares: ["isLoggedIn"],
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
					const result = await Workflow.getCard({ company, cardId });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"POST /cards": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					const object = req.body;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validateWorkflowCards(req.body, "create");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.createCard({ company, object });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					if (error.code === 11000) {
						return res.status(400).json({ success: false, message: "Record already exist." });
					}
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"PUT /cards/:id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const object = req.body;
					const { error } = validateWorkflowCards({ _id: req.params.id, ...object }, "update");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.updateCard({ company, id: req.params.id, object });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"delete /cards/:id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyIdy;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validate(req.params.id, "getOne");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.findByIdAndRemove({ company, id: req.params.id });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"GET /cardElements/:elementId": {
			localMiddlewares: ["isLoggedIn"],
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
		"POST /cardElements": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					const object = req.body;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validateCardElements(req.body, "create");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.createCard({ company, object });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					if (error.code === 11000) {
						return res.status(400).json({ success: false, message: "Record already exist." });
					}
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"PUT /cardElements/:id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const object = req.body;
					const { error } = validateCardElements({ _id: req.params.id, ...object }, "update");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.updateCardElement({ company, id: req.params.id, object });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message, stack: error?.stack });
				}
			},
		},
		"delete /cardElements/:id": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const company = req.body.company;
					if (!company) {
						return res.status(400).json({
							success: false,
							message: "No company found.",
						});
					}
					const { error } = validateCardElements({ _id: req.params.id }, "getOne");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const result = await Workflow.findByIdAndRemove({ company, id: req.params.id });
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
			filter: Joi.object({
				templateId: objectIdSchema,
				personas: Joi.array().items(Joi.string()),
				customerIds: Joi.array().items(
					Joi.object({
						accountName: Joi.string(),
						_id: objectIdSchema,
					})
				),
				userEmails: Joi.array().items(Joi.string()),
				status: Joi.string().valid("ACTIVE", "DRAFT", "INACTIVE", "SCHEDULED"),
				deactivatedDate: Joi.date(),
				flowType: Joi.string().valid("CANCELLATION", "ENGAGEMENT"),
				isScheduled: Joi.boolean(),
				scheduledOn: Joi.date().iso(),
				allowSnooze: Joi.boolean(),
				snoozeTime: Joi.number(),
				allowMinimize: Joi.boolean(),
				allowIgnore: Joi.boolean(),
				validity: Joi.number(),
				deliveryChannel: Joi.string().valid("IN_APP", "EMAIL", "BOTH", ""),
				engagementType: Joi.string().valid("ONBOARDING", "ADOPTION", "ADVOCACY"),
			}),
			projection: Joi.object(),
			sort: Joi.object(),
			pageNo: Joi.number(),
			pageSize: Joi.number(),
			startTime: Joi.string(),
			endTime: Joi.string(),
		}),
		getOne: objectIdSchema,
		create: Joi.object({
			templateId: objectIdSchema.required(),
			workflowName: Joi.string(),
			description: Joi.string(),
			status: Joi.string().valid("ACTIVE", "DRAFT", "INACTIVE").required(),
			flowType: Joi.string().valid("CANCELLATION", "ENGAGEMENT"),
		}),
		update: Joi.object({
			id: objectIdSchema,
			templateId: objectIdSchema,
			workflowName: Joi.string(),
			personas: Joi.array().items(Joi.string()),
			customerIds: Joi.array().items(
				Joi.object({
					accountName: Joi.string().required(),
					_id: objectIdSchema.required(),
				})
			),
			description: Joi.string(),
			createdBy: objectIdSchema,
			userEmails: Joi.array().items(Joi.string().email()),
			status: Joi.string().valid("ACTIVE", "DRAFT", "INACTIVE", "SCHEDULED"),
			deactivatedDate: Joi.date(),
			flowType: Joi.string().valid("CANCELLATION", "ENGAGEMENT"),
			isScheduled: Joi.boolean(),
			scheduledOn: Joi.date().allow(""),
			timezone: Joi.string().allow(""),
			allowSnooze: Joi.boolean(),
			snoozeTime: Joi.number(),
			allowMinimize: Joi.boolean(),
			allowNotificationValidity: Joi.boolean(),
			allowIgnore: Joi.boolean(),
			validity: Joi.number(),
			deliveryChannel: Joi.string().valid("IN_APP", "EMAIL", "BOTH", "").allow(""),
			isDeployed: Joi.boolean(),
			step: Joi.string().valid("EDIT", "SCHEDULE", "AUDIENCE", "NOTIFICATION_SETTING", "DEPLOY"),
		}),
		copyEmail: Joi.object({
			id: objectIdSchema,
			templateId: objectIdSchema,
			workflowName: Joi.string(),
			description: Joi.string(),
			createdBy: objectIdSchema,
			status: Joi.string().valid("ACTIVE", "DRAFT", "INACTIVE"),
			flowType: Joi.string().valid("CANCELLATION", "ENGAGEMENT"),
			deliveryChannel: Joi.string().valid("IN_APP", "EMAIL", "BOTH", "").allow(""),
			step: Joi.string().valid("EDIT", "SCHEDULE", "AUDIENCE", "NOTIFICATION_SETTING", "DEPLOY"),
		}),
	};
	return schema[endpointName].validate(data);
};

const validateWorkflowCards = (data, endpointName) => {
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
			videoId: Joi.object(),
			cardThumbnailUrl: Joi.string().allow(""),
			videoThumbnailUrl: Joi.string().allow(""),
			imageUrl: Joi.object().allow(null),
			templateId: objectIdSchema.required(),
			parentId: objectIdSchema.required(),
			parentBranchId: Joi.string(),
		}),
		update: Joi.object({
			_id: objectIdSchema.required(),
			label: Joi.string(),
			videoId: Joi.object(),
			cardThumbnailUrl: Joi.string(),
			videoThumbnailUrl: Joi.string().allow(""),
			imageUrl: Joi.object().allow(null),
			templateId: objectIdSchema,
			parentId: objectIdSchema,
			parentBranchId: Joi.string(),
		}),
	};
	return schema[endpointName].validate(data);
};

const validateCardElements = (data, endpointName) => {
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
			cardId: objectIdSchema.required(),
		}),
		create: Joi.object({
			cardId: objectIdSchema.required(),
			elements: Joi.array().items(elementSchema),
		}),
		update: Joi.object({
			_id: objectIdSchema.required(),
			elements: Joi.array().items(elementSchema),
		}),
	};
	return schema[endpointName].validate(data);
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
	const elementSchema = Joi.object({
		index: Joi.number().required(),
		meta: Joi.object().required(),
	});
	const schema = {
		get: Joi.object({
			sortOrder: Joi.string(),
			sortBy: Joi.string(),
		}),
	};
	return schema[endpointName].validate(data);
};
