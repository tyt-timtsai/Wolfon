const router = require('express').Router();
const Community = require('../controllers/community');

router.get('/', Community.search);

router.get('/:id', Community.get);

router.post('/', Community.create);

router.post('/:id', Community.apply);

router.patch('/:id', Community.confirmApply);

module.exports = router;
