require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { AdminModel } = require('../database/models/admin');

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await AdminModel.findOne({ username: username });

        if (!user) {
            throw new createError(401, 'Not authorized');
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                const payload = { username: username, admin: true };

                const token = jwt.sign(payload, process.env.PRIVATE_KEY);

                res.status(200).json({ access_token: token });
            } else {
                throw new createError(401, 'Not authorized');
            }
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;