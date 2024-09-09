const router = require('express').Router();
const CategoryContoller = require('../controllers/CategoryController');
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     name: Create Category
 *     summary: Create New Category
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
 *     responses:
 *       200:
 *         description: Category Added
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/', auth, fileUpoload().signleUpload('image'), (req, res) => CategoryContoller().create(req, res));


/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     name: List Categories
 *     summary: List All Categories
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

router.get('/', (req, res) => CategoryContoller().getAll(req, res));


/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     name: List One Categories
 *     summary: List One Categories with id
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

router.get('/:id', (req, res) => CategoryContoller().get(req, res));


/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     name: Update One Category
 *     summary: Update One Category with id
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
 *       - in: body
 *         schema:
 *           type: object
 *           properties:
 *              name:
 *                type: string
 *              type:
 *                type: integer
 *              parent_id:
 *                type: integer
 *     responses:
 *       200:
 *         description: Action successful
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.put('/order', auth, fileUpoload().signleUpload('image'), (req, res) => CategoryContoller().updateOrder(req, res));

router.put('/:id', auth, fileUpoload().signleUpload('image'), (req, res) => CategoryContoller().update(req, res));

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     name: Delete One Category
 *     summary: Delete One Category with id
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
router.delete('/:id', (req, res) => CategoryContoller().destroy(req, res));

module.exports = router;
