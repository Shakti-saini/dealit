const router = require('express').Router();
const CartContoller = require('../controllers/CartController');
const auth = require('../policies/auth.policy');
/**
 * @swagger
 * /api/cart:
 *   post:
 *     tags:
 *       - Cart
 *     name: Add to cart
 *     summary: Add to cart
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             price:
 *               type: number
 *             variant:
 *               type: string
 *             product_id:
 *               type: number
 *             product_sku:
 *               type: string
 *             quantity:
 *               type: number
 *         required:
 *           - type
 *     responses:
 *       200:
 *         description: Request completed sucessfully!
 *       401:
 *         description: Bad Request, not found in db
 *       500:
 *         description: Server error
 *       403:
 *         description: not authorize to do this action

 *
 */

router.post('/', auth, (req, res) => CartContoller().create(req, res));

router.post('/temp', auth, (req, res) => CartContoller().tempCreate(req, res));

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart
 *     name: List Cart
 *     summary: List All Cart
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

router.get('/', auth, (req, res) => CartContoller().getAll(req, res));

/**
 * @swagger
 * /api/cart/id:
 *   put:
 *     tags:
 *       - Cart
 *     name: Update cart
 *     summary: Update cart
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             price:
 *               type: number
 *             variant:
 *               type: string
 *             product_id:
 *               type: number
 *             product_sku:
 *               type: string
 *             quantity:
 *               type: number
 *         required:
 *           - type
 *     responses:
 *       200:
 *         description: Request completed sucessfully!
 *       401:
 *         description: Bad Request, not found in db
 *       500:
 *         description: Server error
 *       403:
 *         description: not authorize to do this action

 *
 */

router.put('/:id', auth, (req, res) => CartContoller().update(req, res));

router.delete('/:id', auth, (req, res) => CartContoller().destroy(req, res));

router.delete('/:id/wishlist', auth, (req, res) => CartContoller().destroyWishlist(req, res));

router.get('/:country_id/tax-shipping', auth, (req, res) => CartContoller().calculateTaxShipping(req, res));

module.exports = router;
