const jwt = require('../utils/JWT');

const { JWT_SECRET } = process.env;

async function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token || token == null) {
    return res.status(401).json({ status: 401, message: 'No Token' });
  }
  try {
    req.userData = await jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    console.log('auth middleware error : ', error);
    return res.status(403).json({ status: 403, message: 'Unauthorized' });
  }
}

module.exports = { auth };
