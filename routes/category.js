const {Router} = require('express');
const protectedRoute = require('../middleware/protectedRoute');
const upload = require('../middleware/upload');
const controller = require('../controllers/category');

const router = Router();

router.get('/', protectedRoute(), controller.getAll);
router.get('/:id', protectedRoute(), controller.getById);
router.delete('/:id', protectedRoute(), controller.remove);
router.post('/', protectedRoute(), upload.single('image'), controller.create);
router.put('/:id', protectedRoute(), upload.single('image'), controller.update);

module.exports = router;