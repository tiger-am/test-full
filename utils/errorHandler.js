module.exports = function errorHandler(res, error) {
    res.status(500).json({
        success: false,
        message: error.message ? error.message : error
    })
};
