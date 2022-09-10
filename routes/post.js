const router = require('express').Router();
const Post = require('../controllers/post');

router.route('/').post(Post.create);

router.route('/:id').get(Post.get);

router.route('/like/:id').get(Post.like);

router.route('/fellow/:id').get(Post.fellow);

router.route('/search').get(Post.search);

module.exports = router;
