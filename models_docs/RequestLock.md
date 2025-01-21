const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const schema = new Schema({
	_id: { type: String, require: true, expires: 300 },
	lockCreatedAt: { type: Date },
});

module.exports = {
	schema: schema,
	RequestLockModel: Mongoose.model("requestLock", schema),
};
