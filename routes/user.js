const router = require('express').Router();
const User = require('../controllers/user');
const { auth } = require('../middlewares/auth');
const { userUpload } = require('../middlewares/multer');

router.route('/').get(auth, User.profile);
router.route('/').post(User.profile);
router.route('/signup').post(User.signUp);
router.route('/signin').post(User.signIn);
router.route('/search').get(User.search);

router.route('/image').post(auth, userUpload.single('image'), User.uploadImage);

router.route('/friend').post(auth, User.applyFriend);
router.route('/friend').patch(auth, User.acceptFriend);
router.route('/friend').put(auth, User.cancelApplyFriend);
router.route('/friend').delete(auth, User.deleteFriend);

router.route('/follow').post(auth, User.follow);
router.route('/follow').delete(auth, User.unfollow);

router.route('/live').get(auth, User.getLive);
router.route('/live').post(User.getLive);

router.route('/post').get(auth, User.getPost);
router.route('/post').post(User.getPost);
router.route('/like').get(auth, User.getLikePost);
router.route('/like').post(User.getLikePost);
router.route('/follow_post').get(auth, User.getFollowPost);
router.route('/follow_post').post(User.getFollowPost);

router.route('/friend').get(auth, User.getFriend);
router.route('/follow').get(auth, User.getFollow);
router.route('/follower').get(auth, User.getFollower);
router.route('/follower').post(User.getFollower);
router.route('/community').get(auth, User.getCommunity);

module.exports = router;
