const router = require('express').Router();
const Live = require('../controllers/live');
const { upload } = require('../middlewares/multer');
const { auth } = require('../middlewares/auth');

router
  .route('/')
  .get(Live.get)
  .post(auth, upload.single('image'), Live.create);

router.route('/:id').delete(auth, Live.deleteLive);
router.route('/screenshot').post(auth, upload.single('image'), Live.uploadScreenshot);
router.route('/search').get(Live.search);

router.route('/upload').post(Live.upload);
router.route('/complete').post(Live.completeUpload);

module.exports = router;
