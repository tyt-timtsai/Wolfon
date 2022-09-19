const router = require('express').Router();
const User = require('../controllers/user');
const { auth } = require('../middlewares/auth');

router.route('/').get(auth, User.profile);
router.route('/signup').post(User.signUp);
router.route('/signin').post(User.signIn);
router.route('/search').get(User.search);

router.route('/friend').post(auth, User.applyFriend);
router.route('/friend').patch(auth, User.addFriend);
router.route('/friend').put(auth, User.cancelApplyFriend);
router.route('/friend').delete(auth, User.deleteFriend);

router.route('/follow').post(auth, User.fellow);
router.route('/follow').delete(auth, User.unfellow);

router.route('/live').get(auth, User.getLive);
router.route('/post').get(auth, User.getPost);
router.route('/friend').get(auth, User.getFriend);
router.route('/community').get(auth, User.getCommunity);

module.exports = router;
