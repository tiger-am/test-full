const {Router} = require('express');
const controller = require('../controllers/order');
const protectedRoute = require('../middleware/protectedRoute');

const router = Router();

router.get('/', protectedRoute(), controller.getAll);
router.post('/', protectedRoute(), controller.create);

module.exports = router;