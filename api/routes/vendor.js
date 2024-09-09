const router = require('express').Router();
const ProductContoller = require('../controllers/ProductController');
const UserContoller = require('../controllers/UserController');
const BrandContoller = require('../controllers/BrandController');
const StoreController = require('../controllers/StoreController');
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');
/**
 * @swagger
 * /api/vendor/products:
 *   get:
 *     tags:
 *       - Vendor
 *     name: List vendor Products
 *     summary: List vendor All Products
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

router.get('/products', auth, (req, res) => ProductContoller().getVendorProduct(req, res));

/**
 * @swagger
 * /api/vendor/brands:
 *   get:
 *     tags:
 *       - Vendor
 *     name: List Vendor Brand
 *     summary: List All Vendor Brand
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

router.get('/brands', auth, (req, res) => BrandContoller().getVendorBrands(req, res));

/**
 * @swagger
 * /api/vendor/userdetail/:id:
 *   get:
 *     tags:
 *       - Vendor
 *     name: User detail
 *     summary: User detail
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

router.get('/userdetail/:id', auth, (req, res) => UserContoller().getUserDetail(req, res));


/**
 * @swagger
 * /api/vendor/userdetail/:id:
 *   put:
 *     tags:
 *       - Vendor
 *     name: User detail
 *     summary: User detail
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

router.put('/userdetail/:id', auth, fileUpoload().signleUpload('image'), (req, res) => UserContoller().updateUserDetail(req, res));


// /route for vendor store..
router.get('/store', auth, (req, res) => StoreController().get(req, res));

router.post('/store', auth, fileUpoload().businessUploads(), (req, res) => StoreController().createOrUpdate(req, res));

router.put('/store', auth, (req, res) => StoreController().updateSettings(req, res));

module.exports = router;
