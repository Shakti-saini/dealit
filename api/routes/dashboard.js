const router = require('express').Router();
const DashboardController = require('../controllers/DashboardController');
const auth = require('../policies/auth.policy');


router.get('/', auth, (req, res) => DashboardController().get(req, res));

module.exports = router;
