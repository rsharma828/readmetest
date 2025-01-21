/**
 * middleware for if the user has a valid token and push the user object to the request header
 * isLoggedIn
 */
const { logger } = require("../utils");
module.exports = async (req, res, next, { Services /* ,config */ }) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(403).json({ success: false, message: "No Authorization received in headers." });
	}

	try {
		const token = authorization.replace("Bearer ", "");
		let response = await Services.WorkOS.verifyAccessToken(token);
		if (!response?.success) {
			return res.status(403).json(response);
		}
		const userData = await Services.WorkOS.getUserInfo(response.data.sub);
		const user = await Services.UserProfiles.findUserWithCompany({ emailId: userData?.data?.email });

		if (!user) {
			logger.error("Could not find the user.");
			return res.status(403).json({ success: false, message: "Could not find the user." });
		}
		req.user = user;
		req.onboardingDetails = await Services.OnboardingDetails.findOne({ companyId: user.companyId._id });
		next();
	} catch (error) {
		logger.error(error);
		return res.status(403).json({ success: false, message: error.message });
	}
};
