const router = require('express').Router();
const Community = require('../controllers/community');
const { auth } = require('../middlewares/auth');

router.get('/:id', Community.get);

router.post('/', auth, Community.create);

router.post('/:id', auth, Community.apply);

router.patch('/:id', auth, Community.confirmApply);

module.exports = router;
