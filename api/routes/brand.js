const router = require('express').Router();
const BrandContoller = require('../controllers/BrandController');
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');

/**
 * @swagger
 * /api/brands:
 *   post:
 *     tags:
 *       - Brand
 *     name: Create Brand
 *     summary: Create New Brand
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
 *     responses:
 *       200:
 *         description: Brand Added
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/', auth, fileUpoload().signleUpload('image'), (req, res) => BrandContoller().create(req, res));


/**
 * @swagger
 * /api/brands:
 *   get:
 *     tags:
 *       - Brand
 *     name: List Brand
 *     summary: List All Brand
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

router.get('/', (req, res) => BrandContoller().getAll(req, res));


/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     tags:
 *       - Brand
 *     name: List One Brand
 *     summary: List One Brand with id
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

router.get('/:id', (req, res) => BrandContoller().get(req, res));

/**
 * @swagger
 * /api/brands:
 *   post:
 *     tags:
 *       - Brand
 *     name: Update Brand
 *     summary: Update Brand
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
 *     responses:
 *       200:
 *         description: Brand Added
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.put('/:id', auth, fileUpoload().signleUpload('image'), (req, res) => BrandContoller().update(req, res));

router.delete('/:id', auth, (req, res) => BrandContoller().destroy(req, res));

module.exports = router;
