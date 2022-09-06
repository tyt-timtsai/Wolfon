const router = require('express').Router();
const User = require('../controllers/user');

router.route('/signup').post(User.signUp);

router.route('/signin').post(User.signIn);

module.exports = router;
