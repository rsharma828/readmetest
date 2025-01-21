const Joi = require("joi");
module.exports.routes = function (props) {
	const {
		Services: { UserProfiles, Utility },
		config: { CONSTANTS },
	} = props;
	return {
		"GET /retentionExperts": {
			localMiddlewares: ["isLoggedIn", "isRetAdmin"],
			handler: async function (req, res) {
				try {
					const { user, query: params, onboardingDetails } = req;
					let { companyId } = user;
					let company = companyId;
					companyId = company._id;

					const query = {
						filter: params.filter ? JSON.parse(decodeURI(params.filter)) : {},
						pageNo: Number(params.pageNo) || 1, // Default to 1 if not provided
						pageSize: Number(params.pageSize) || CONSTANTS.defaultPageSize,
					};

					const { error } = validate(query, "getRetExp");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}

					let filter = {
						...query.filter,
						companyId,
						role: "RETENTION_EXPERT",
					};

					const result = await UserProfiles.getRetentionExperts({
						query: filter,
						projection: null,
						pageNo: query.pageNo,
						pageSize: query.pageSize,
						search: params.search,
						company,
						onboardingDetails,
						user,
					});
					if (!result) {
						return res.status(400).json({
							success: false,
							message: `No data found.`,
						});
					}
					return res.status(200).json({
						success: true,
						message: "Data fetched successfully",
						data: result,
					});
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"POST /retentionExpert": {
			localMiddlewares: ["isLoggedIn", "isRetAdmin"],
			handler: async function (req, res) {
				try {
					const { user, body } = req;
					let { companyId } = user;
					let company = companyId;
					companyId = company._id;
					companyDomain = company.companyRegisteredDomain;

					const { error } = validate(body, "createRetExp");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}
					const domain = Utility.getEmailDomain(body.email);
					if (companyDomain !== domain) {
						return res.status(400).json({ success: false, error: "Invalid email domain" });
					}
					const result = await UserProfiles.createRetExpAndSendEmail({
						body: {
							emailId: body.email,
							inviteStatus: "PENDING",
							role: "RETENTION_EXPERT",
							profilePicUrl: "",
							companyId,
						},
						companyId,
						companyDomain,
					});
					if (!result?.success) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"GET /": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const userId = req.user._id;
					const result = await UserProfiles.findUserWithCompany({ _id: userId });
					if (!result) {
						return res.status(400).json({
							success: false,
							message: `No details found for user id = ${userId}`,
						});
					}
					return res.status(200).json({
						success: true,
						message: "Data fetched successfully",
						data: result,
					});
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"PUT /": {
			localMiddlewares: ["isLoggedIn", "FileUpload"],
			handler: async function (req, res) {
				try {
					const userId = req.user._id;
					const updateObj = { ...req.body };
					
					// Check if a profile picture is provided
					if (req.files && req.files.profilePic) {
						const profilePic = req.files.profilePic;

						// Validate the profile picture format
						if (!CONSTANTS.allowedImageMimeTypes.includes(profilePic.mimetype)) {
							return res.status(400).json({
								success: false,
								message: "Invalid image format for profile picture, please provide a JPEG or PNG file.",
							});
						}

						// Add the profile picture to the update object
						updateObj.profilePic = profilePic;
					}

					// Update the user profile
					const updateResult = await UserProfiles.updateProfile(userId, updateObj, { new: true });

					if (!updateResult.success) {
						return res.status(400).json({
							success: false,
							message: `Failed to update data for user id = ${userId}`,
						});
					}

					return res.status(200).json({
						success: true,
						message: "Data updated successfully",
						data: updateResult.result,
					});
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"DELETE /retentionExpert": {
			localMiddlewares: ["isLoggedIn", "isRetAdmin"],
			handler: async function (req, res) {
				try {
					const { user, body } = req;

					const { error } = validate(body, "deleteRetExp");
					if (error) {
						return res.status(400).json({ success: false, error: error.details[0].message });
					}

					const result = await UserProfiles.deleteRetentionExpert({
						retExpertEmail: body.retExpertEmail,
						user,
					});
					if (!result) {
						return res.status(400).json(result);
					}
					return res.status(200).json(result);
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"GET /checkRetentionExpert": {
			localMiddlewares: ["isLoggedIn"],
			handler: async function (req, res) {
				try {
					const { user } = req;
					const result = await UserProfiles.findOne({ emailId: user.emailId });

					return res.status(200).json({
						success: true,
						isRetentionExpert: !!(result && result.role === "RETENTION_EXPERT"),
					});
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
	};
};

const validate = (data, endpointName) => {
	const schema = {
		createRetExp: Joi.object({
			email: Joi.string().email().required(),
		}),
		getRetExp: Joi.object({
			filter: Joi.object(),
			pageNo: Joi.number(),
			pageSize: Joi.number(),
			search: Joi.string(),
			sortBy: Joi.string(),
			sortOrder: Joi.string().allow("asc", "desc"),
		}),
		deleteRetExp: Joi.object({
			retExpertEmail: Joi.string().email().required(),
		}),
	};
	return schema[endpointName].validate(data);
};
