const Joi = require("joi");

module.exports.routes = function (props) {
	const {
		Services: { GlobalConfig },
	} = props;
	return {
		"GET /": {
			localMiddlewares: ["isLoggedIn", "isKaleAdmin"],
			handler: async function (req, res) {
				try {
					const industryType = req.user.companyId?.enrichedData?.enrichment_industry || "general";
					const projectionKeys = req.query?.projection && JSON.parse(decodeURI(req.query.projection));
					const projection = {};
					if (projectionKeys?.length > 0) {
						projectionKeys.forEach((key) => {
							projection[key] = 1;
						});
					}
					const data = await GlobalConfig.findOne({ industryType }, projection);
					if (!data) {
						return res.status(404).json({ success: false, message: "no data found" });
					}
					return res.status(200).json({ success: true, data });
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
	};
};
