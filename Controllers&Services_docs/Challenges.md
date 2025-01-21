const Joi = require("joi");

module.exports.routes = function (props) {
	const {
		Services: { Challenges, Utility },
	} = props;
	return {
		"GET /": {
			handler: async function (req, res) {
				try {
					const filter = req.query.filter && JSON.parse(req.query.filter);
					const projectionKeys = req.query.projection && JSON.parse(req.query.projection);
					const projection = {};
					if (projectionKeys?.length > 0) {
						projectionKeys.forEach((key) => {
							projection[key] = 1;
						});
					}
					const data = await Challenges.find(filter, projection);
					if (!data) {
						return res.status(404).json({ success: false, message: "no data found" });
					}
					return res.status(200).json({ success: true, data });
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"POST /": {
			handler: async function (req, res) {
				try {
					const body = req.body;
					const { error } = validate(body, false);
					if (error) return res.status(400).json({ success: false, error: error.details[0].message });
					const { success, message, result } = await Challenges.create(body);
					if (!success) {
						return res.status(400).json({ success, message });
					}
					return res.status(200).json({ success, message, result });
				} catch (error) {
					if (error.code === 11000) {
						return res.status(400).json({
							success: false,
							message: "challenge already exist.",
						});
					}
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"PUT /:id": {
			handler: async function (req, res) {
				try {
					const body = req.body;
					const _id = req.params.id;
					const { error } = validate(body, false);
					if (error) return res.status(400).json({ success: false, error: error.details[0].message });
					const { success, message, result } = await Challenges.updateOne(_id, body);
					if (!success) {
						return res.status(400).json({ success, message });
					}
					return res.status(200).json({ success, message, result });
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
		"DELETE /:id": {
			handler: async function (req, res) {
				try {
					const _id = req.params.id;
					const { success, message, result } = await Challenges.findByIdAndRemove(_id);
					if (!success) {
						return res.status(400).json({ success, message });
					}
					return res.status(200).json({ success, message, result });
				} catch (error) {
					return res.status(500).json({ success: false, message: error.message });
				}
			},
		},
	};
};

const validate = (data, isUpdate = false) => {
	const add = Joi.object({
		label: Joi.string().required(),
	});
	const update = Joi.object({
		label: Joi.string().required(),
	});
	const schema = isUpdate ? update : add;
	return schema.validate(data);
};
