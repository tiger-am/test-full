const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports = {
    async getAll(req, res) {
        const {offset = 0, limit = 0, start, end, order} = req.query;
        const {id: user} = req.user;
        const query = {user};

        if (start) query.date = {$gte: start};

        if (end) {
            if (!query.date) query.date = {};
            query.date.$lte = end
        }

        if(order) query.order = +order;

        try {
            const orders = await Order
                .find(query)
                .sort({date: -1})
                .skip(+offset)
                .limit(+limit);

            res.status(200).json(orders)
        } catch (e) {
            errorHandler(res, e)
        }
    },

    async create(req, res) {
        try {
            const lastOrder = await Order
                .findOne({user: req.user.id})
                .sort({date: -1});

            const maxOrder = lastOrder ? lastOrder.order : 0;

            const order = await new Order({
                list: req.body.list,
                user: req.user.id,
                order: maxOrder + 1
            }).save();

            res.status(201).json(order)
        } catch (e) {
            errorHandler(res, e)
        }
    }
};