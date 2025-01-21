const Joi = require("joi");

module.exports.routes = function (props) {
	const {
		Services: { ProductUsageData, UserEnrichmentData, OnboardingDetails },
	} = props;
	return {
		"POST /upload-csv": {
			localMiddlewares: ["isLoggedIn", "isProductUploadPermitted", "FileUpload"],
			handler: async function (req, res) {
				try {
					const file = req.files.product_usage_data;
					const userEmail = req.user.emailId;
					const { body, user, onboardingDetails } = req;
					const { error } = validate({ userEmail }, "uploadCSV");

					if (error) {
						const errorMessage = error.details[0]?.message || "Joi validation failed.";
						logger.warn(`Validation error: ${errorMessage}`, { userEmail });
						return res.status(400).json({
							success: false,
							error: errorMessage,
						});
					}

					if (file?.mimetype !== "text/csv") {
						return res.status(400).json({
							success: false,
							message: "improper file format, upload csv file only.",
						});
					}
					const result = await ProductUsageData.upload(file, user, onboardingDetails);
					if (!result?.success) {
						return res.status(400).json(result);
					}
					return res
						.status(200)
						.json({ success: true, message: "product usage data uploaded successfully." });
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},

		"GET /refresh-customer-mapping": {
			localMiddlewares: ["isLoggedIn", "isProductUploadPermitted"],
			handler: async function (req, res) {
				try {
					const { user, onboardingDetails } = req;
					const result = await ProductUsageData.refreshCustomerMapping({ user, onboardingDetails });
					if (!result?.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
	};
};

const validate = (data, endpointName) => {
	const schema = {
		uploadCSV: Joi.object({
			userEmail: Joi.string().email().required(),
		}),
	};
	return schema[endpointName].validate(data);
};
