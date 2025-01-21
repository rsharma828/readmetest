const { logger } = require("utils");
module.exports.routes = function (props) {
	const {
		Services: {},
		config,
	} = props;
	return {
		"POST /callback": {
			handler: async function (req, res) {
				try {
					logger.debug("[CALLBACK_FROM_WORKER]: ", req.body);
					res.json({
						success: true,
						acknowledged: true,
					});
				} catch (error) {
					logger.error(error);
					return res.status(500).json({
						success: false,
						message: error.message || "Internal Server Error.",
					});
				}
			},
		},
	};
};
