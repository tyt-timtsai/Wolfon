// const { expect } = require('chai');
const supertest = require('supertest');
const { describe, it } = require('mocha');
// const { signIn } = require('../controllers/user');

const api = supertest('http://localhost:3000/api/v1');

describe('POST /user/signin', () => {
  it('Should login exist user and return JWT token', (done) => {
    api.post('/user/signin')
      .set('Accept', 'application/json')
      .send({
        data: {
          email: 'sam22@gmail.com',
          password: 'sam22',
        },
      })
      .expect(200)
      .end((err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('Should login exist user with wrong password and return 403', (done) => {
    api.post('/user/signin')
      .set('Accept', 'application/json')
      .send({
        data: {
          email: 'sam22@gmail.com',
          password: '222222',
        },
      })
      .expect(403)
      .end((err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('Should login user with wrong password and return 400', (done) => {
    api.post('/user/signin')
      .set('Accept', 'application/json')
      .send({
        data: {
          email: 'sam22@gmail.com',
          password: '',
        },
      })
      .expect(400)
      .end((err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('Should login user with wrong password and return 400', (done) => {
    api.post('/user/signin')
      .set('Accept', 'application/json')
      .send({
        data: {
          email: '',
          password: 'sam22',
        },
      })
      .expect(400)
      .end((err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('Should login not register user and return 401', (done) => {
    api.post('/user/signin')
      .set('Accept', 'application/json')
      .send({
        data: {
          email: 'sam223344@gmail.com',
          password: 'sam22',
        },
      })
      .expect(401)
      .end((err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
});
