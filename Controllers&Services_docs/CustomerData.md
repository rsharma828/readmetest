const Joi = require("joi");

module.exports.routes = function (props) {
	const {
		Services: { CustomerData },
	} = props;
	return {
		"POST /upload-csv": {
			localMiddlewares: ["isLoggedIn", "FileUpload"],
			handler: async function (req, res) {
				try {
					const file = req.files.customer_data;
					const userEmail = req.user.emailId;
					const { user, onboardingDetails } = req;
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
					const result = await CustomerData.upload(file, user, onboardingDetails);
					if (!result?.success) {
						return res.status(400).json(result);
					}
					return res
						.status(200)
						.json({ success: true, message: "customer data uploaded successfully." });
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},

		"GET /refresh-customer-mapping": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const { user, onboardingDetails } = req;
					const result = await CustomerData.refreshCustomerMapping({ user, onboardingDetails });
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
