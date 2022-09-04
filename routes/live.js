const router = require('express').Router();
const Live = require('../controllers/live');

router.route('/').get(Live.getLive);

module.exports = router;
