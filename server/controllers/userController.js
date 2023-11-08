const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const createToken = (_id) => {
	const jwtKey = process.env.JWT_SECRET_TOKEN;
	return jwt.sign({ _id }, jwtKey, { expiresIn: '3d' });
	//  payload, key, options
};

const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json('User with this email already exists');
		}

		if (!name || !email || !password) {
			return res.status(400).json('All fields are required');
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json('Email must be valid');
		}

		if (!validator.isStrongPassword(password)) {
			return res.status(400).json('Password must be strong');
		}

		const salt = await bcrypt.genSalt(10); // by default is 10
		const PasswordHash = await bcrypt.hash(password, salt);

		const userDoc = await User.create({
			name,
			email,
			password: PasswordHash,
		});

		if (!userDoc) return res.status(400).json('user not created');

		const token = createToken(userDoc._id);
		res.status(200).json({
			_id: userDoc._id,
			name,
			email,
			token,
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json('No such user');
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return res.status(400).json('Invalid credentials');
		}

		const token = createToken(user._id);
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email,
			token,
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const getUsers = async (req, res) => {
	const users = await User.find();
	try {
		if (!users) {
			return res.status(400).send('no users');
		}
		return res.status(200).json(users);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const findUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).send('no such user');
		}
		return res.status(200).json(user);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

module.exports = {
	registerUser,
	loginUser,
	getUsers,
	findUser,
};
