const router = require('express').Router();
const User = require('../controllers/user');

router.route('/').get(User.profile);
router.route('/signup').post(User.signUp);
router.route('/signin').post(User.signIn);
router.route('/search').get(User.search);

router.route('/friend').post(User.applyFriend);
router.route('/friend').patch(User.addFriend);
router.route('/friend').put(User.cancelApplyFriend);
router.route('/friend').delete(User.deleteFriend);

router.route('/fellow').post(User.fellow);
router.route('/fellow').delete(User.unfellow);

module.exports = router;
