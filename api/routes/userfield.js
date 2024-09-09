const router = require('express').Router();
const UserFieldController = require('../controllers/UserFieldController');
const auth = require('../policies/auth.policy');
/**
 * @swagger
 * /api/userfield:
 *   post:
 *     tags:
 *       - userfield
 *     name: User Sinup filed
 *     summary: User Sinup filed
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
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             password:
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

router.post('/', (req, res) => UserFieldController().create(req, res));

router.get('/', (req, res) => UserFieldController().get(req, res));


module.exports = router;
