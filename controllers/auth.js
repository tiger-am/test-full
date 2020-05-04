const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const {findOne} = User;
require('dotenv').config();

module.exports = {
    async login(req, res) {
        const {email, password: pass} = req.body;
        const candidate = await User.findOne({email});

        if (!candidate) {
            // Error

            res.status(404).json({
                message: 'Такого пользователя не существует'
            })
        } else {
            // Login

            const {password: factPass, email, _id: userId} = candidate;
            const password = bcrypt.compareSync(pass, factPass);

            if (password) {
                // Create token

                let token = `Bearer ${jwt.sign(
                    {email, userId},
                    process.env.JWT_KEY,
                    {expiresIn: 60 * 60})}`;

                res.status(200).json({token})
            } else {
                // Error

                res.status(401).json({
                    message: 'Неверный пароль'
                })
            }
        }
    },

    async register(req, res) {
        const {email, password: pass} = req.body;
        const candidate = await User.findOne({email});

        if (candidate) {
            // Error

            res.status(409).json({
                message: 'Такой E-mail уже занят. Попробуйте другой'
            })
        } else {
            // Create

            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(pass, salt);
            const user = new User({email, password});

            try {
                await user.save();

                res.status(201).json(user)
            } catch (e) {
                res.status(409).json({
                    message: 'Такой E-mail уже занят. Попробуйте другой'
                })
            }
        }
    }
};