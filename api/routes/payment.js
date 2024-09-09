const router = require('express').Router();
const OrderController = require('../controllers/OrderController');
const PaymentController = require('../controllers/PaymentController');
const auth = require('../policies/auth.policy');

router.get('/ipn', (req, res) => OrderController().pesaPalIpn(req, res));

router.get('/braintree/token', auth, (req, res) => PaymentController().createToken(req, res));

router.post('/braintree/checkout', auth, (req, res) => PaymentController().createtCheckout(req, res));

module.exports = router;
