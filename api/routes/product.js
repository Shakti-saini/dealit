const router = require('express').Router();
const ProductContoller = require('../controllers/ProductController');
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     name: Create Poducts
 *     summary: Create New Product
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: formData
 *           name: image
 *           type: file
 *         - in: formData
 *           name: name
 *           type: string
 *         - in: formData
 *           name: product_id
 *           type: string
 *         - in: formData
 *           name: description
 *           type: string
 *         - in: formData
 *           name: sku
 *           type: string
 *         - in: formData
 *           name: quantity
 *           type: string
 *         - in: formData
 *           name: cost_price
 *           type: string
 *         - in: formData
 *           name: mrp_price
 *           type: string
 *         - in: formData
 *           name: offer_price
 *           type: string
 *     responses:
 *       200:
 *         description: Product Added
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/', auth, fileUpoload().productUploads(), (req, res) => ProductContoller().create(req, res));


/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     name: List Products
 *     summary: List All Products
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

router.get('/', (req, res) => ProductContoller().getAll(req, res));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     name: List One Products
 *     summary: List One Products with id
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Action successful
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.get('/:id', (req, res) => ProductContoller().get(req, res));
router.get('/:id/reviews', (req, res) => ProductContoller().getReviews(req, res));
router.get('/:id/related', (req, res) => ProductContoller().getRelated(req, res));
router.get('/:id/stores', (req, res) => ProductContoller().getRelatedStores(req, res));
router.get('/:id/cart', auth, (req, res) => ProductContoller().getCart(req, res));


/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     name: Update Poducts
 *     summary: Update Product
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: formData
 *           name: image
 *           type: file
 *         - in: formData
 *           name: name
 *           type: string
 *         - in: formData
 *           name: product_id
 *           type: string
 *         - in: formData
 *           name: description
 *           type: string
 *         - in: formData
 *           name: sku
 *           type: string
 *         - in: formData
 *           name: quantity
 *           type: string
 *         - in: formData
 *           name: cost_price
 *           type: string
 *         - in: formData
 *           name: mrp_price
 *           type: string
 *         - in: formData
 *           name: offer_price
 *           type: string
 *     responses:
 *       200:
 *         description: Product Added
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.put('/:id', auth, fileUpoload().productUploads(), (req, res) => ProductContoller().update(req, res));

router.delete('/:id/image/:key', auth, (req, res) => ProductContoller().destroyImage(req, res, 'images'));
router.delete('/:id/document/:key', auth, (req, res) => ProductContoller().destroyImage(req, res, 'documents'));

module.exports = router;
