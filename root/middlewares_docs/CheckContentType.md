const { logger } = require("utils");

module.exports = async function (req, res, next, { Services, config }) {
	if (req.headers["content-type"]) {
		return next();
	}

	let data = "";
	const contentLength = req.get("content-length");

	if (contentLength > 0 && req.method === "POST") {
		req.on("data", (chunk) => {
			data += chunk;
		});

		req.on("end", () => {
			try {
				req.body = JSON.parse(data);
			} catch (error) {
				console.error("Failed to parse JSON:", error);
				req.body = {};
			}
			next();
		});
	} else {
		next();
	}
};
