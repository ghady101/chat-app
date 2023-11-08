const Message = require('../models/messageModel');

const createMessage = async (req, res) => {
	try {
		const { chatId, senderId, text } = req.body;

		const message = new Message({
			chatId,
			senderId,
			text,
		});
		const response = await message.save();

		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

const getMessages = async (req, res) => {
	try {
		const { chatId } = req.params;

		const messages = await Message.find({ chatId });
		if (!messages) {
			return res.status(404).json('No messages found');
		}

		return res.status(200).json(messages);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

module.exports = { createMessage, getMessages };
