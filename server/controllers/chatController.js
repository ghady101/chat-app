const { Chat } = require('../models/chatModel');

// create chat
const createChat = async (req, res) => {
	const { firstId, secondId } = req.body;
	try {
		const existingChat = await Chat.findOne({
			members: { $all: [firstId, secondId] },
		});

		if (existingChat) {
			return res.status(200).json(existingChat);
		}

		const newChat = new Chat({
			members: [firstId, secondId],
		});

		const response = await newChat.save();

		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

// get user chats
const findUserChats = async (req, res) => {
	const { userId } = req.params;
	try {
		const chats = await Chat.find({
			members: {
				$in: [userId],
			},
		});
		return res.status(200).json(chats);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

// find chat
const findChat = async (req, res) => {
	const { firstId, secondId } = req.params;
	try {
		const chat = await Chat.findOne({
			members: {
				$all: [firstId, secondId],
			},
		});
		return res.status(200).json(chat);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

module.exports = { createChat, findUserChats, findChat };
