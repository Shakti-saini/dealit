const router = require('express').Router();
const FaqContoller = require('../controllers/FaqController');
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     name: Create Faq
 *     summary: Create New Faq
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: formData
 *           name: question
 *           type: string
 *         - in: formData
 *           name: answer
 *           type: string
 *     responses:
 *       200:
 *         description: Faq Added
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/', auth, fileUpoload().signleUpload('image'), (req, res) => FaqContoller().create(req, res));


/**
 * @swagger
 * /api/faqs:
 *   get:
 *     name: List Faq
 *     summary: List All Faq
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

router.get('/', (req, res) => FaqContoller().getAll(req, res));


/**
 * @swagger
 * /api/faqs/{id}:
 *   get:
 *     name: List One Faq
 *     summary: List One Faq with id
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

router.get('/:id', (req, res) => FaqContoller().get(req, res));

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     name: Update Faq
 *     summary: Update Faq
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: formData
 *           name: question
 *           type: string
 *         - in: formData
 *           name: answer
 *           type: string
 *     responses:
 *       200:
 *         description: Faq Updated
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.put('/:id', auth, fileUpoload().signleUpload('image'), (req, res) => FaqContoller().update(req, res));


module.exports = router;
