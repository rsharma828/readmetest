const { parse } = require("dotenv");
const Joi = require("joi");
const { logger } = require("utils");

module.exports.routes = function (props) {
	const {
		Services: { OnboardingDetails, Companies },
	} = props;

	return {
		"GET /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const { user, onboardingDetails } = req;
					const userEmail = user.emailId;
					// const { error } = validate({ userEmail }, "get");

					// if (error) {
					// 	const errorMessage = error.details[0]?.message || "Joi validation failed.";
					// 	logger.warn(`Validation error: ${errorMessage}`, { userEmail });
					// 	return res.status(400).json({
					// 		success: false,
					// 		error: errorMessage,
					// 	});
					// }

					// const userEmailDomain = userEmail.includes("@") ? userEmail.split("@")[1] : null;

					// if (!userEmailDomain) {
					// 	logger.error("Invalid email format:", { userEmail });
					// 	return { success: false, message: "Invalid email format" };
					// }

					// const company = await Companies.findOne({ companyRegisteredDomain: userEmailDomain });

					// if (!company) {
					// 	return res.status(404).json({
					// 		success: false,
					// 		message: `Company not found.`,
					// 	});
					// }

					// const result = await OnboardingDetails.findOne({ companyId: company._id });

					// if (!result) {
					// 	return res.status(404).json({
					// 		success: false,
					// 		message: `No data found.`,
					// 	});
					// }

					return res.status(200).json({
						success: true,
						message: "Data fetched successfully",
						data: onboardingDetails,
					});
				} catch (error) {
					logger.error("Error fetching onboarding details:", error);
					return res.status(500).json({
						success: false,
						message: "Internal Server Error",
					});
				}
			},
		},
		"PUT /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const { user, onboardingDetails } = req;
					const userEmail = user.emailId;
					// const { error } = validate({ userEmail }, "get");
					// if (error) {
					// 	const errorMessage = error.details[0]?.message || "Joi validation failed.";
					// 	logger.warn(`Validation error: ${errorMessage}`, { userEmail });
					// 	return res.status(400).json({ success: false, error: errorMessage });
					// }

					// const userEmailDomain = userEmail.includes("@") ? userEmail.split("@")[1] : null;

					// if (!userEmailDomain) {
					// 	logger.error("Invalid email format:", { userEmail });
					// 	return { success: false, message: "Invalid email format" };
					// }

					const currentScreen = req.query?.currentScreen?.trim().toLowerCase();
					const onboardingSkip = req.query?.onboardingSkip === "true";
					if (!currentScreen) {
						return res.status(400).json({ success: false, message: "Invalid current screen parameter" });
					}

					// const company = await Companies.findOne({ companyRegisteredDomain: userEmailDomain });

					// if (!company) {
					// 	return res.status(404).json({
					// 		success: false,
					// 		message: `Company not found.`,
					// 	});
					// }

					const updateResult = await OnboardingDetails.updateOne(
						{ _id: onboardingDetails._id },
						{ currentScreen, onboardingSkip },
						{ new: true }
					);

					if (!updateResult) {
						return res.status(400).json({
							success: false,
							message: `Failed to update data for company ID: ${user.companyId?._id}`,
						});
					}

					return res
						.status(200)
						.json({ success: true, message: "Data updated successfully", data: updateResult });
				} catch (error) {
					logger.error("Error updating onboarding details:", error);
					return res.status(500).json({ success: false, message: "Internal Server Error" });
				}
			},
		},
	};
};

const validate = (data, endpointName) => {
	const schema = {
		get: Joi.object({
			userEmail: Joi.string().email().required(),
		}),
	};
	return schema[endpointName].validate(data);
};
