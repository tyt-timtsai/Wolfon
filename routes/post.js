const router = require('express').Router();
const Post = require('../controllers/post');
const { auth } = require('../middlewares/auth');

router.route('/')
  .get(Post.get)
  .post(auth, Post.create);

router.route('/search').get(Post.search);
router.route('/user').get(auth, Post.getUserPost);

router.route('/like/:id').get(auth, Post.like);
router.route('/follow/:id').get(auth, Post.follow);

router
  .route('/:id')
  .get(Post.getOne)
  .patch(auth, Post.update)
  .delete(auth, Post.deletePost);

module.exports = router;
