const router = require('express').Router();
const AddressContoller = require('../controllers/AddressController');
const auth = require('../policies/auth.policy');
/**
 * @swagger
 * /api/address:
 *   post:
 *     tags:
 *       - Address
 *     name: Add address
 *     summary: Add address
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
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             address:
 *               type: string
 *             phone:
 *               type: string
 *             city:
 *               type: string
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

router.post('/', auth, (req, res) => AddressContoller().create(req, res));

/**
 * @swagger
 * /api/address:
 *   get:
 *     tags:
 *       - Address
 *     name: List Address
 *     summary: List All Address
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

router.get('/', auth, (req, res) => AddressContoller().getAll(req, res));

/**
 * @swagger
 * /api/address/id:
 *   put:
 *     tags:
 *       - Address
 *     name: Update address
 *     summary: Update address
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

router.put('/:id', auth, (req, res) => AddressContoller().update(req, res));

router.delete('/:id', auth, (req, res) => AddressContoller().destroy(req, res));

module.exports = router;
