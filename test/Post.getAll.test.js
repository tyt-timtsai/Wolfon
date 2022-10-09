/* eslint-disable no-underscore-dangle */
const supertest = require('supertest');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const api = supertest('http://localhost:3000/api/v1');

describe('GET /post', () => {
  it('Should return Post data', (done) => {
    api.get('/post')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.data[0]).to.have.property('_id');
          expect(res.body.data[0]).to.have.property('user_id');
          expect(res.body.data[0]).to.have.property('author');
          expect(res.body.data[0]).to.have.property('author_photo');
          expect(res.body.data[0]).to.have.property('likes');
          expect(res.body.data[0]).to.have.property('followers');
          expect(res.body.data[0]).to.have.property('view');
          expect(res.body.data[0]).to.have.property('created_dt');
          expect(res.body.data[0]).to.have.property('updated_dt');
          expect(res.body.data[0]).to.have.property('title');
          expect(res.body.data[0]).to.have.property('subtitle');
          expect(res.body.data[0]).to.have.property('content');
          expect(res.body.data[0].view).to.be.a('number');
          done();
        }
      });
  });
});
