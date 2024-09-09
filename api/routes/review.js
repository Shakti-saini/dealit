const router = require('express').Router();
const ReviewContoller = require('../controllers/ReviewController');
const auth = require('../policies/auth.policy');

router.post('/', (req, res) => ReviewContoller().create(req, res));

router.get('/', auth, (req, res) => ReviewContoller().getAll(req, res));

router.get('/:id', auth, (req, res) => ReviewContoller().get(req, res));

router.put('/:id', auth, (req, res) => ReviewContoller().update(req, res));

router.delete('/:id', auth, (req, res) => ReviewContoller().destroy(req, res));

module.exports = router;
