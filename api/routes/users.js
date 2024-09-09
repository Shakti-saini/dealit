const router = require('express').Router();
const UserContoller = require('../controllers/UserController');
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');
/**
 * @swagger
 * /api/users/authorize:
 *   post:
 *     tags:
 *       - Users
 *     name: Login
 *     summary: Authorize User
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: 'admin@dealit.uk'
 *             password:
 *               type: string
 *               format: password
 *               example: 'Password123'
 *             role:
 *               type: string
 *               example: 'vendor'
 *         required:
 *           - email
 *           - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/authorize', (req, res) => UserContoller().login(req, res));
router.post('/authorize/social', (req, res) => UserContoller().socialLogin(req, res));

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     name: Register
 *     summary: Register New User
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
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *             password2:
 *               type: string
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             phone:
 *               type: string
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             zip_code:
 *               type: string
 *             main_phone:
 *               type: string
 *         required:
 *           - email
 *           - password
 *           - first_name
 *           - last_name
 *           - phone
 *     responses:
 *       200:
 *         description: Registration successful
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/register', fileUpoload().signleUpload('image'), (req, res) => UserContoller().register(req, res));

/**
 * @swagger
 * /api/users/addcustomer:
 *   post:
 *     tags:
 *       - Users
 *     name: Add customer
 *     summary: Add New Customer
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
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
*             phone:
 *               type: string
 *         required:
 *           - email
 *           - password
 *           - phone
 *     responses:
 *       200:
 *         description: Registration successful
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/addcustomer', auth, fileUpoload().signleUpload('image'), (req, res) => UserContoller().addCustomer(req, res));

/**
 * @swagger
 * /api/users/addvendor:
 *   post:
 *     tags:
 *       - Users
 *     name: Add vendor
 *     summary: Add New Vendor
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
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             middle_name:
 *               type: string
 *             website_link:
 *               type: string
 *             phone:
 *               type: string
 *             address:
 *               type: string
 *             state:
 *               type: string
 *             city:
 *               type: string
 *             zip_code:
 *               type: string
 *             main_phone:
 *               type: string
 *         required:
 *           - email
 *           - password
 *           - first_name
 *           - last_name
 *           - phone
 *     responses:
 *       200:
 *         description: Registration successful
 *       401:
 *         description: Bad Request, not found in db
 *
 */

router.post('/addvendor', auth, fileUpoload().signleUpload('image'), (req, res) => UserContoller().addVendor(req, res));

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     name: List Users
 *     summary: List All Users
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
router.get('/', auth, (req, res) => UserContoller().getAll(req, res));

/**
 * @swagger
 * /api/users/:id:
 *   get:
 *     tags:
 *       - User detail
 *     name: User detail
 *     summary: User detail
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
router.get('/detail', auth, (req, res) => UserContoller().myprofile(req, res));
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     name: Update
 *     summary: Update User
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *         - in: body
 *           schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *                      format: password
 *                  first_name:
 *                      type: string
 *                  last_name:
 *                       type: string
 *     responses:
 *       200:
 *         description: Update successful
 *       401:
 *         description: Bad Request, ot found in db
 *
 */

router.put('/:id', auth, fileUpoload().signleUpload('image'), (req, res) => UserContoller().update(req, res));

/**
 * @swagger
 * /api/users/forgotpassword:
 *   post:
 *     tags:
 *       - Users
 *     name: Forgotpassword
 *     summary: Forgotpassword
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
 *             email:
 *               type: string
 *         required:
 *           - email
 *     responses:
 *       200:
 *         description: Invitation sent sucessfully!
 *       401:
 *         description: Bad Request, not found in db
 *       500:
 *         description: Server error , email not sent

 *
 */

router.post('/verifyotp', (req, res) => UserContoller().verifyOtp(req, res));
router.post('/forgotpassword', (req, res) => UserContoller().forgotPassword(req, res));
router.post('/resetpassword', (req, res) => UserContoller().resetPassword(req, res));

/**
 * @swagger
 * /api/users/changepassword:
 *   post:
 *     tags:
 *       - Users
 *     name: Change password
 *     summary: Change password
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
 *             password:
 *               type: string
 *             old_password:
 *               type: string
 *             token:
 *               type: string
 *         required:
 *           - password
 *           - old_password
 *           - token
 *     responses:
 *       200:
 *         description: Invitation sent sucessfully!
 *       401:
 *         description: Bad Request, not found in db
 *       500:
 *         description: Server error , email not sent

 *
 */


router.post('/changepassword', auth, (req, res) => UserContoller().changePassword(req, res));

router.get('/notifications', auth, (req, res) => UserContoller().getNotifications(req, res));

router.delete('/notifications/:id', auth, (req, res) => UserContoller().deleteNotifications(req, res));

// Get User followers
router.get('/followers', auth, (req, res) => UserContoller().allFollowers(req, res, 'followers'));
// Get User followers
router.get('/followings', auth, (req, res) => UserContoller().allFollowers(req, res, 'followings'));
// Follow
router.get('/follow/:id', auth, (req, res) => UserContoller().followUnfllow(req, res, 'follow'));
// Unfollow
router.get('/unfollow/:id', auth, (req, res) => UserContoller().followUnfllow(req, res, 'unfollow'));
// Get single user..
router.get('/:id', auth, (req, res) => UserContoller().getUserByID(req, res));

module.exports = router;
