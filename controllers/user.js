const argon2 = require('argon2');
const User = require('../models/user');

async function signUp(req, res) {
  const { name, email, password } = req.body.data;
  const exist = await User.signIn(email);
  if (exist != null) {
    return res.status(401).json({ status: 401, message: 'Email is already registed.' });
  }
  const photo = req.body.file;
  const id = Math.floor(Math.random() * 1000000);
  const onboard = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -5);
  const hash = await argon2.hash(password);
  const userData = {
    id,
    name,
    email,
    password: hash,
    photo,
    onboard,
    friends: [],
    clubs: [],
    posts: [],
    fellowers: [],
  };
  await User.signUp(userData);
  return res.status(200).send(userData);
}

async function signIn(req, res) {
  const { email, password } = req.body.data;
  const userData = await User.signIn(email);
  if (userData == null) {
    return res.status(404).json({ status: 404, message: 'User not found' });
  }
  try {
    if (await argon2.verify(userData.password, password)) {
      return res.status(200).json({ status: 200, message: 'success' });
    }
    return res.status(403).json({ status: 403, message: 'Wrong password' });
  } catch (error) {
    console.log('sign in decode error : ', error);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
}

module.exports = { signUp, signIn };
