const router = require('express').Router();
const BlogContoller = require('../controllers/BlogController');
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');

/**
 * @swagger
 * /api/blog:
 *   post:
 *     tags:
 *       - Blog
 *     name: Create Blog
 *     summary: Create New Blog
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
 *         description: Blog Added
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/', auth, fileUpoload().signleUpload('image'), (req, res) => BlogContoller().create(req, res));


/**
 * @swagger
 * /api/blog:
 *   get:
 *     tags:
 *       - Blog
 *     name: List Blog
 *     summary: List All Blog
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

router.get('/', (req, res) => BlogContoller().getAll(req, res));


/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     tags:
 *       - Blog
 *     name: List One Blog
 *     summary: List One Blog with id
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

router.get('/:id', (req, res) => BlogContoller().get(req, res));

router.put('/:id', auth, fileUpoload().signleUpload('image'), (req, res) => BlogContoller().update(req, res));

router.delete('/:id', auth, (req, res) => BlogContoller().destroy(req, res));

module.exports = router;
