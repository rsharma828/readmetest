const Joi = require("joi");
const mongoose = require("mongoose");
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { Media },
	} = props;

	return {
		"POST /upload": {
			localMiddlewares: ["isLoggedIn", "FileUpload"],
			handler: async function (req, res) {
				try {
					const file = req.files;
					if (!file) {
						return res.status(400).json({
							success: false,
							message: "No file found for upload.",
						});
					}
					const result = await Media.upload({ file });
					const statusCode = result.success ? 200 : 400;
					return res.status(statusCode).json(result);
				} catch (error) {
					if (error.code == 11000) {
						logger.error(error);
						return res.status(400).json({
							success: false,
							message: "record already exist.",
						});
					}
					logger.error(error);
					return res.status(500).json({
						success: false,
						message: error.message,
						stack: error.stack,
					});
				}
			},
		},
		"GET /": {
			localMiddlewares: ["isLoggedIn", "isKaleAdmin"],
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
					const result = await Media.find({ filter, sortOrder, sortBy });
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
		"GET /duplicate": {
			handler: async function (req, res) {
				try {
					const company = req.user.companyId;
					const { blobUrl } = req.query;
					const result = await Media.duplicate({ blobUrl, company });
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
			filter: Joi.object({
				label: Joi.string(),
				mimeType: Joi.string(),
				containerName: Joi.string(),
				fileUrl: Joi.string(),
			}),
			sortOrder: Joi.string(),
			sortBy: Joi.string(),
		}),
	};
	return schema[endpointName].validate(data);
};
