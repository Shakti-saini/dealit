const router = require('express').Router();
const BannerContoller = require('../controllers/BannerController');
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');

/**
 * @swagger
 * /api/banners:
 *   post:
 *     tags:
 *       - Banner
 *     name: Create Banner
 *     summary: Create New Banner
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: formData
 *           name: image
 *           type: file
 *         - in: formData
 *           name: title
 *           type: string
 *         - in: formData
 *           name: description
 *           type: string
 *         - in: formData
 *           name: from_date
 *           type: date
 *         - in: formData
 *           name: date
 *           type: string
 *     responses:
 *       200:
 *         description: Banner Added
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/', auth, fileUpoload().signleUpload('image'), (req, res) => BannerContoller().create(req, res));


/**
 * @swagger
 * /api/banners:
 *   get:
 *     tags:
 *       - Banner
 *     name: List Banner
 *     summary: List All Banner
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

router.get('/', (req, res) => BannerContoller().getAll(req, res));


/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     tags:
 *       - Banner
 *     name: List One Banner
 *     summary: List One Banner with id
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

router.get('/:id', (req, res) => BannerContoller().get(req, res));

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

router.put('/order', auth, fileUpoload().signleUpload('image'), (req, res) => BannerContoller().updateOrder(req, res));

router.put('/:id', auth, fileUpoload().signleUpload('image'), (req, res) => BannerContoller().update(req, res));

router.delete('/:id', auth, (req, res) => BannerContoller().destroy(req, res));

module.exports = router;
