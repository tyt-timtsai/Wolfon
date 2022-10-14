/* eslint-disable no-underscore-dangle */
// const { expect } = require('chai');
// const { profile } = require('../controllers/user');
const supertest = require('supertest');
const { before, describe, it } = require('mocha');

const api = supertest('http://localhost:3000/api/v1');
let token;

before((done) => {
  api.post('/user/signin')
    .set('Accept', 'application/json')
    .send({
      data: {
        email: 'sam22@gmail.com',
        password: 'sam22',
      },
    })
    .expect(200)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        token = res.body.data;
        done();
      }
    });
});

describe('GET /user', () => {
  it('Should send JWT token and return user data', (done) => {
    api.get('/user')
      .set('authorization', token)
      .expect(200)
      .end((err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('Should miss JWT token and return 401', (done) => {
    api.get('/user')
      .expect(401)
      .end((err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('Should send wrong JWT token return 403', (done) => {
    api.get('/user')
      .set('authorization', token - 1111)
      .expect(403)
      .end((err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
});
