const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
require('./connection');

const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);

// connection localhost:5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running at port ${port}`);
});
