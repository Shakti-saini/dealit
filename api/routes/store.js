const router = require('express').Router();
const fileUpoload = require('../services/fileUpload.service');
const auth = require('../policies/auth.policy');
const StoreController = require('../controllers/StoreController');

router.get('/', (req, res) => StoreController().getAll(req, res));

router.get('/:slug', (req, res) => StoreController().getBySlug('store', req, res));

router.get('/:slug/products', (req, res) => StoreController().getBySlug('products', req, res));

router.get('/:slug/categories', (req, res) => StoreController().getBySlug('categories', req, res));

router.get('/:slug/brands', (req, res) => StoreController().getBySlug('brands', req, res));

router.post('/:id', auth, fileUpoload().businessUploads(), (req, res) => StoreController().updateById(req, res));

router.post('/:id/video', auth, fileUpoload().signleUpload('video'), (req, res) => StoreController().uploadStoreVideo(req, res));

router.delete('/:id', auth, (req, res) => StoreController().destroy(req, res));

module.exports = router;
