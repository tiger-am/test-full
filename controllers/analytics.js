const moment = require('moment');
const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports = {
    async overview(req, res) {
        try {
            const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
            const ordersMap = getOrdersMap(allOrders);
            const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('YYYY.MM.DD')] || [];

            // zakazov vchera
            const yesterdayOrdersNumbers = yesterdayOrders.length;

            // кол-во заказов
            const totalOrdersNumber = allOrders.length;

            // кол-во дней
            const daysNumber = Object.keys(ordersMap).length;

            // заказов в день
            const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);

            // процент для кол-ва заказов
            // (кол-во заказов вчера / кол-во заказов в день) - 1 * 100
            const ordersPercent = ((yesterdayOrdersNumbers / ordersPerDay - 1) * 100).toFixed(2);

            // общая выручка
            const totalGain = calculatePrice(allOrders);

            // выручка в день
            const gainPerDay = totalGain / daysNumber;

            // вчерашняя выручка
            const yesterdayGain = calculatePrice(yesterdayOrders);

            // процент выручки
            const gainPercent = ((yesterdayGain / gainPerDay - 1) * 100).toFixed(2);

            // сравнение выручки
            const compareGain = (yesterdayGain - gainPerDay).toFixed(2);

            // сравнение кол-ва заказов
            const compareNumber = (yesterdayOrdersNumbers - ordersPerDay).toFixed(2);

            res.status(200).json({
                gain: {
                    percent: Math.abs(+gainPercent),
                    compare: Math.abs(+compareGain),
                    yesterday: +yesterdayGain,
                    isHigher: +gainPercent > 0
                },
                orders: {
                    percent: Math.abs(+ordersPercent),
                    compare: Math.abs(+compareNumber),
                    yesterday: +yesterdayOrdersNumbers,
                    isHigher: +ordersPercent > 0
                }
            })
        } catch (e) {
            errorHandler(res, e)
        }
    },

    async analytics(req, res) {
        try {
            const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
            const ordersMap = getOrdersMap(allOrders);

            const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);

            const chart = Object.keys(ordersMap).map(label => {
                const gain = calculatePrice(ordersMap[label]);
                const order = ordersMap[label].length;

                return {label, order, gain}
            });

            res.status(200).json({average, chart});
        } catch (e) {
            errorHandler(res, e)
        }
    },
};

function getOrdersMap(orders = []) {
    const daysOrders = {};

    orders.forEach(order => {
        const date = moment(order.date).format('YYYY.MM.DD');

        if (date === moment().format('YYYY.MM.DD')) {
            return
        }

        if (!daysOrders[date]) {
            daysOrders[date] = [];
        }

        daysOrders[date].push(order);
    });

    return daysOrders
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        return total + order.list.reduce((orderTotal, {cost, quantity}) => {
            return cost * quantity + orderTotal
        }, 0)
    }, 0)
}