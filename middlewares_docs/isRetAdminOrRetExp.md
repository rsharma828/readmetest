/**
 * middleware for checking role of user is retention admin
 * isRetAdmin
 */
const { logger } = require("../utils");
module.exports = async (req, res, next, { Services /* ,config */ }) => {
	if (req.user.role === "RETENTION_ADMIN" || req.user.role === "RETENTION_EXPERT") {
		next();
	} else {
		return res.status(403).json({
			success: false,
			message: "Authorization failed. You are not allowed to access this route.",
		});
	}
};
