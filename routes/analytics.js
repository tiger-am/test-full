const {Router} = require('express');
const controller = require('../controllers/analytics');
const protectedRoute = require('../middleware/protectedRoute');

const router = Router();

router.get('/overview', protectedRoute(), controller.overview);
router.get('/analytics', protectedRoute(), controller.analytics);

module.exports = router;