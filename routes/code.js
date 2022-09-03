const router = require('express').Router();
const Code = require('../controllers/code');

router.get('/:id', Code.getVersion);

router.post('/', Code.compile);

router.post('/:id', Code.addVersion);

module.exports = router;
