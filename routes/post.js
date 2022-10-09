const router = require('express').Router();
const Post = require('../controllers/post');
const { auth } = require('../middlewares/auth');

router.route('/').post(auth, Post.create);

router
  .route('/:id')
  .get(Post.get)
  .patch(auth, Post.update)
  .delete(auth, Post.deletePost);

router.route('/like/:id').get(auth, Post.like);

router.route('/follow/:id').get(auth, Post.follow);

module.exports = router;
