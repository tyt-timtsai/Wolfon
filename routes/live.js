const router = require('express').Router();
const Live = require('../controllers/live');

router.route('/').get(Live.getLive);
router.route('/').post(Live.createLive);

router.route('/upload').post(Live.upload);
router.route('/complete').post(Live.completeUpload);

module.exports = router;
