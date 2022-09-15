const router = require('express').Router();
const Live = require('../controllers/live');

router.route('/').get(Live.get);
router.route('/').post(Live.createLive);
router.route('/search').get(Live.search);

router.route('/upload').post(Live.upload);
router.route('/complete').post(Live.completeUpload);

module.exports = router;
