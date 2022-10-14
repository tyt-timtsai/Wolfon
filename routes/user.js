const router = require('express').Router();
const User = require('../controllers/user');
const { auth } = require('../middlewares/auth');
const { userUpload } = require('../middlewares/multer');

router
  .route('/')
  .get(auth, User.profile)
  .post(User.profile);

router.route('/signup').post(User.signUp);
router.route('/signin').post(User.signIn);
router.route('/search').get(User.search);

router.route('/image').post(auth, userUpload.single('image'), User.uploadImage);

router
  .route('/friend')
  .get(auth, User.getFriend)
  .post(auth, User.applyFriend)
  .patch(auth, User.acceptFriend)
  .put(auth, User.cancelApplyFriend)
  .delete(auth, User.deleteFriend);

router
  .route('/follow')
  .get(auth, User.getFollow)
  .post(auth, User.follow)
  .delete(auth, User.unfollow);

router
  .route('/live')
  .get(auth, User.getLive)
  .post(User.getLive);

router
  .route('/post')
  .get(auth, User.getPost)
  .post(User.getPost);
router
  .route('/like')
  .get(auth, User.getLikePost)
  .post(User.getLikePost);
router
  .route('/follow_post')
  .get(auth, User.getFollowPost)
  .post(User.getFollowPost);

router
  .route('/follower')
  .get(auth, User.getFollower)
  .post(User.getFollower);

module.exports = router;
