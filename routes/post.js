const router = require('express').Router();
const Post = require('../controllers/post');

router.route('/').get(Post.get);
router.route('/').post(Post.create);

module.exports = router;
