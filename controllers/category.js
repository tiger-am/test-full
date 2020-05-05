const Category = require('../models/Category');
const Position = require('../models/Position');
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
        try {
            const category = await Category.findById(req.params.id);
            res.status(200).json(category)
        } catch (e) {
            errorHandler(res, e)
        }
    },

    async remove(req, res) {
        try {
            await Category.remove({_id: req.params.id});
            await Position.remove({category: req.params.id});

            res.status(200).json({
                message: 'Категория успешно удалена'
            })
        } catch (e) {
            errorHandler(res, e)
        }
    },

    async create(req, res) {
        const category = new Category({
            name: req.body.name,
            user: req.user.id,
            image: req.file ? req.file.path : ''
        });

        try {
            await category.save();
            res.status(201).json(category)
        } catch (e) {
            errorHandler(res, e)
        }
    },

    async update(req, res) {
        const updated = {name: req.body.name};

        if (req.file) updated.image = req.file.path;

        try {
            const category = await Category.findOneAndUpdate(
                {_id: req.params.id},
                {$set: updated},
                {new: true}
            );

            res.status(200).json(category)
        } catch (e) {
            errorHandler(res, e)
        }
    }
};