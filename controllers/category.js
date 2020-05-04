const Category = require('../models/Category');
const errorHandler = require('../utils/errorHandler');

module.exports = {
    async getAll(req, res) {
        try {
            const categories = await Category.find({user: req.user.id});
            res.status(200).json(categories)
        } catch (e) {
            errorHandler(res, e)
        }
    },

    async getById(req, res) {

    },

    async create(req, res) {

    },

    async remove(req, res) {

    },

    async update(req, res) {

    },
};