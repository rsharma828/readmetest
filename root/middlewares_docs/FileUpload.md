const fileUpload = require("express-fileupload");

module.exports = fileUpload({
	limits: { fileSize: 15 * 1024 * 1024 },
});
