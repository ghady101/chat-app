const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
	{
		members: Array,
	},
	{ timestamps: true }
);

const Chat = mongoose.model('chat', chatSchema);

module.exports = { Chat };
