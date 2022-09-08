const router = require('express').Router();
const Post = require('../controllers/post');

router.route('/').get(Post.get);
router.route('/').post(Post.create);
router.route('/like/:id').get(Post.like);
router.route('/fellow/:id').get(Post.fellow);

module.exports = router;
