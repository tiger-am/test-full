const {Router} = require('express');
const controller = require('../controllers/position');
const protectedRoute = require('../middleware/protectedRoute');

const router = Router();

router.get('/:categoryId', protectedRoute(), controller.getByCategoryId);
router.post('/', protectedRoute(), controller.create);
router.put('/:id', protectedRoute(), controller.update);
router.delete('/:id', protectedRoute(), controller.remove);

module.exports = router;