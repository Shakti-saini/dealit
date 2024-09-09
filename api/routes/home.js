const router = require('express').Router();
const FrontpageController = require('../controllers/FrontPageController');
const auth = require('../policies/auth.policy');
/**
 * @swagger
 * /api/home:
 *   get:
 *     tags:
 *       - Home
 *     name: List Home page data
 *     summary: List Home page data
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: Action successful
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.get('/', (req, res) => FrontpageController().getAll(req, res));

router.post('/search', (req, res) => FrontpageController().searchProduct(req, res));

router.post('/sendotp', auth, (req, res) => FrontpageController().sendOtp(req, res));

router.post('/verifyotp', auth, (req, res) => FrontpageController().verifyOtp(req, res));

// route for social media icons..
router.get('/social', (req, res) => FrontpageController().getSetting(req, res, 'social_links'));

router.post('/social', auth, (req, res) => FrontpageController().updateSetting(req, res, 'social_links'));

// route for social contact page..
router.get('/contact-page', (req, res) => FrontpageController().getSetting(req, res, 'contact_page'));

router.post('/contact-page', auth, (req, res) => FrontpageController().updateSetting(req, res, 'contact_page'));

router.get('/continents', (req, res) => FrontpageController().getCountry(req, res, 'continents'));

router.get('/countries', (req, res) => FrontpageController().getCountry(req, res, 'countries'));

router.get('/countries/:id', (req, res) => FrontpageController().getCountry(req, res, 'countries_by_id'));

router.get('/states/:id', (req, res) => FrontpageController().getCountry(req, res, 'states'));

router.get('/cities/:id', (req, res) => FrontpageController().getCountry(req, res, 'cities'));

router.get('/ipinfo/', (req, res) => FrontpageController().getIpCountry(req, res));

module.exports = router;
