const router = require('express').Router();
const Post = require('../controllers/post');
const { auth } = require('../middlewares/auth');

router.route('/').post(auth, Post.create);

router.route('/:id').get(Post.get);

router.route('/like/:id').get(auth, Post.like);

router.route('/fellow/:id').get(auth, Post.fellow);

// router.route('/search').get(Post.search);

module.exports = router;
