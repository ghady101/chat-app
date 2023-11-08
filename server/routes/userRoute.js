const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	getUsers,
	findUser,
} = require('../controllers/userController');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/', getUsers);

router.get('/find/:id', findUser);

module.exports = router;
