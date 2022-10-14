const router = require('express').Router();
const Code = require('../controllers/code');

router.post('/', Code.compile);

router.get('/:id', Code.getVersion);

router.post('/:id', Code.addVersion);

module.exports = router;
