const JWT = require('jsonwebtoken');

const algorithm = 'HS256';

function sign(payload, secret) {
  return new Promise((resolve, reject) => {
    JWT.sign(payload, secret, { algorithm }, (err, token) => {
      if (err) {
        console.log('JWT sign error : ', err);
        return reject(err);
      }
      return resolve(token);
    });
  });
}

function verify(token, secret) {
  return new Promise((resolve, reject) => {
    JWT.verify(token, secret, { algorithm }, (err, decode) => {
      if (err) {
        console.log('JWT verify error : ', err);
        return reject(err);
      }
      return resolve(decode);
    });
  });
}

module.exports = { sign, verify };
