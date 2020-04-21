require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AdminModel } = require('../database/models/admin');

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await AdminModel.findOne({ username: username });

        if (!user) {
            res.status(401).json({ message: 'Not authorized' })
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                const payload = { username: username, admin: true };

                const token = jwt.sign(payload, process.env.PRIVATE_KEY);

                res.status(200).json({ access_token: token });
            } else {
                res.status(401).json({ message: 'Not authorized' });
            }
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;