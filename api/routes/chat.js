const router = require('express').Router();
const ChatController = require('../controllers/ChatController');
const auth = require('../policies/auth.policy');

router.post('/', auth, (req, res) => ChatController().create(req, res));

router.get('/', auth, (req, res) => ChatController().getAll(req, res));

router.get('/vendor/:id', auth, (req, res) => ChatController().getVendorChat(req, res));

router.get('/:id', auth, (req, res) => ChatController().get(req, res));

router.put('/:id', auth, (req, res) => ChatController().update(req, res));

router.delete('/:id', auth, (req, res) => ChatController().destroy(req, res));

module.exports = router;
