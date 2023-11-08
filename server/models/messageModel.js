const { default: mongoose } = require('mongoose');

const messageSchema = new mongoose.Schema(
	{
		chatId: String,
		senderId: String,
		text: String,
	},
	{ timestamps: true }
);

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;
