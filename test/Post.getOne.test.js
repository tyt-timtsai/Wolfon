/* eslint-disable no-underscore-dangle */
const supertest = require('supertest');
const { before, describe, it } = require('mocha');
const { expect } = require('chai');

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

describe('GET /post/:id', () => {
  it('Should send params and return Post data', (done) => {
    api.get('/post/63429b5e7872594a1e3b37e8')
      .set('authorization', token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.data).to.have.property('post');
          expect(res.body.data).to.have.property('userData');
          expect(res.body.data.post).to.have.property('_id');
          expect(res.body.data.post).to.have.property('user_id');
          expect(res.body.data.post).to.have.property('author');
          expect(res.body.data.post).to.have.property('author_photo');
          expect(res.body.data.post).to.have.property('likes');
          expect(res.body.data.post).to.have.property('followers');
          expect(res.body.data.post).to.have.property('view');
          expect(res.body.data.post).to.have.property('created_dt');
          expect(res.body.data.post).to.have.property('updated_dt');
          expect(res.body.data.post).to.have.property('title');
          expect(res.body.data.post).to.have.property('subtitle');
          expect(res.body.data.post).to.have.property('content');
          expect(res.body.data.post.view).to.be.a('number');
          done();
        }
      });
  });

  it('Should send empty params and return 400', (done) => {
    api.get('/post/63429b')
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
});
