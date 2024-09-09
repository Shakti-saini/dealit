const router = require('express').Router();
const NewsletterController = require('../controllers/NewsletterController');
const auth = require('../policies/auth.policy');


router.post('/', (req, res) => NewsletterController().create(req, res));

router.get('/', auth, (req, res) => NewsletterController().getAll(req, res));

router.get('/:id', auth, (req, res) => NewsletterController().get(req, res));

router.put('/:id', auth, (req, res) => NewsletterController().update(req, res));

router.delete('/:id', auth, (req, res) => NewsletterController().destroy(req, res));

module.exports = router;
