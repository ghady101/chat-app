const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pifbaab.mongodb.net/chat-app?retryWrites=true&w=majority`;

const connection = mongoose
	.connect(uri, { useNewUrlParser: true })
	.then(() => console.log('connected successfully'))
	.catch((error) => console.log(error));

module.exports = connection;
