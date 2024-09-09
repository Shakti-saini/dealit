const router = require('express').Router();
const PageContoller = require('../controllers/PageController');
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');

/**
 * @swagger
 * /api/pages:
 *   post:
 *     tags:
 *       - Page
 *     name: Create Page
 *     summary: Create New Page
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
 *           name: description
 *           type: string
 *         - in: formData
 *           name: page_type
 *           type: string
 *     responses:
 *       200:
 *         description: Page Added
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/', auth, fileUpoload().signleUpload('image'), (req, res) => PageContoller().create(req, res));


/**
 * @swagger
 * /api/pages:
 *   get:
 *     tags:
 *       - Page
 *     name: List Page
 *     summary: List All Page
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

router.get('/', (req, res) => PageContoller().getAll(req, res));


/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     tags:
 *       - Page
 *     name: List One Page
 *     summary: List One Page with id
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

router.get('/:id', (req, res) => PageContoller().get(req, res));

/**
 * @swagger
 * /api/pages:
 *   put:
 *     tags:
 *       - Page
 *     name: Update Page
 *     summary: Update Page
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
 *           name: description
 *           type: string
 *         - in: formData
 *           name: page_type
 *           type: string
 *     responses:
 *       200:
 *         description: Page Added
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.put('/:id', auth, fileUpoload().signleUpload('image'), (req, res) => PageContoller().update(req, res));


module.exports = router;
