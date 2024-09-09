const router = require('express').Router();
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');
const StripeController = require('../controllers/StripeController');

router.post('/makePayment', auth, (req, res) => StripeController().createtCheckout(req, res));
router.post('/refundPayment', auth, (req, res) => StripeController().refundPayment(req, res));


module.exports = router;
