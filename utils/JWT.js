const JWT = require('jsonwebtoken');

const algorithm = 'HS256';
const expiresIn = '10h';

function sign(payload, secret) {
  return new Promise((resolve, reject) => {
    JWT.sign(payload, secret, { algorithm, expiresIn }, (err, token) => {
      if (err) {
        console.log('JWT sign error : ', err);
        return reject(err);
      }
      return resolve(token);
    });
  });
}

function verify(token, secret) {
  const jwt = token.replace('Bearer ', '');
  return new Promise((resolve, reject) => {
    JWT.verify(jwt, secret, { algorithm }, (err, decode) => {
      if (err) {
        console.log('JWT verify error : ', err);
        return reject(err);
      }
      return resolve(decode);
    });
  });
}

module.exports = { sign, verify };
