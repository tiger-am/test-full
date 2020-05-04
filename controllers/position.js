const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');

module.exports = {
    async getByCategoryId(req, res) {
        try {
            const positions = await Position.find({
                category: req.params.categoryId,
                user: req.user.id
            });

            res.status(200).json(positions)
        } catch (e) {
            errorHandler(res, e)
        }
    },

    async create(req, res) {
        const {name, cost, category} = req.body;

        try {
            const position = await new Position({
                name,
                cost,
                category,
                user: req.user.id
            }).save();

            res.status(201).json(position)
        } catch (e) {
            errorHandler(res, e)
        }
    },

    async remove(req, res) {
        try {
            await Position.remove({_id: req.params.id});

            res.status(200).json({
                message: 'Позиция была удалена'
            })
        } catch (e) {
            errorHandler(res, e)
        }
    },

    async update(req, res) {
        try {
            const position = await Position.findOneAndUpdate(
                {_id: req.params.id},
                {$set: req.body},
                {new: true}
            );

            res.status(200).json(position)
        } catch (e) {
            errorHandler(res, e)
        }
    },
};