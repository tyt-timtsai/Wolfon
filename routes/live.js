const router = require('express').Router();
const Live = require('../controllers/live');
const { upload } = require('../middlewares/multer');

router.route('/').get(Live.get);
router.route('/').post(upload.single('image'), Live.create);
router.route('/search').get(Live.search);

router.route('/upload').post(Live.upload);
router.route('/complete').post(Live.completeUpload);

module.exports = router;
