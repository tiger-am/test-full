module.exports = {
    getAll(req, res) {
        res.status(200).json({
            order: 'from controller'
        })
    },

    getById(req, res) {

    },

    create(req, res) {
        res.status(201).json({
            reg: 'true'
        })
    },

    remove(req, res) {

    },

    update(req, res) {

    },

};