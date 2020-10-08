'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const api = supertest('http://localhost:3135'); // supertest init;
const jwt = require('jsonwebtoken');
const config = require('config');
const {assert} = require('chai');

chai.should();

let secret = config.get('api_token');
let decoded = {
  'sub': '1234567890',
  'name': 'John Doe',
  'admin': true
};
let jwtToken = jwt.sign(decoded, secret);

describe('/candidate/{candidate_id}/basic-info', function () {
  let candidateId = '5265136fbf7359871a000001';
  before(function (done) {
    let basic_info = {
      'first_name': 'Joe',
      'last_name': 'Johny',
      'gender': 'male',
      'date_of_birth': '2018-03-14',
      'title': 'mr'
    };
    api.put('/v1/candidate/' + candidateId + '/basic-info')
      .set('Accept', 'application/json')
      .set('X-Request-Id', 'someRequestId')
      .set('x-request-jwt', jwtToken)
      .send(basic_info)
      .expect(200)
      .end(function (err, res) {
        if (err) {return done(err);}
        done();
      });
  });
  describe('get', function () {
    it('should respond with 200 The basic info of candidate', function (done) {
      /*eslint-disable*/
      var schema = {
        "type": "object",
        "required": [
          "first_name",
          "last_name",
          "_id",
          "created_at",
          "updated_at",
          "__v"
        ],
        "properties": {
          "first_name": {
            "type": "string",
            "pattern": "^[A-Za-zàáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð]+([A-Z a-z\\'àáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð\\-`]*[A-Za-zàáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð]){0,}$",
            "minLength": 2,
            "maxLength": 100
          },
          "last_name": {
            "type": "string",
            "pattern": "^[A-Za-zàáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð]+([A-Z a-z\\'àáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð\\-`]*[A-Za-zàáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð]){0,}$",
            "minLength": 2,
            "maxLength": 100
          },
          "gender": {
            "type": "string",
            "enum": [
              "male",
              "female",
              "other"
            ]
          },
          "date_of_birth": {
            "type": "string",
            "format": "date-time"
          },
          "_id": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time"
          },
          "__v": {
            "type": "integer"
          },
          "title": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.get('/v1/candidate/' + candidateId + '/basic-info')
        .set('Accept', 'application/json')
        .set('X-Request-Id', 'someRequestId')
        .set('x-request-jwt', jwtToken)
        .expect(200)
        .end(function (err, res) {
          if (err) {return done(err);}

          validator.validate(res.body, schema).should.be.true;
          done();
        });
    });

    it('should respond with 400 Validation error on get', function (done) {
      /*eslint-disable*/
      var schema = {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string",
            "enum": [
              "PATTERN",
              "ENUM_MISMATCH"
            ]
          },
          "message": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.get('/v1/candidate/someInvalidId/basic-info')
        .set('Accept', 'application/json')
        .set('X-Request-Id', 'someRequestId')
        .set('x-request-jwt', jwtToken)
        .expect(400)
        .end(function (err, res) {
          if (err) {return done(err);}

          validator.validate(res.body, schema).should.be.true;
          done();
        });
    });

    it('should respond with 401 Failed to authenticate the...', function (done) {
      /*eslint-disable*/
      var schema = {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string",
            "enum": [
              "UNAUTHORIZED"
            ]
          },
          "message": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.get('/v1/candidate/' + candidateId + '/basic-info')
        .set('Accept', 'application/json')
        .set('X-Request-Id', 'someRequestId')
        .set('x-request-jwt', jwtToken + 'someId')
        .expect(401)
        .end(function (err, res) {
          if (err) {return done(err);}

          validator.validate(res.body, schema).should.be.true;
          done();
        });
    });

    it('should respond with 404 Resource not found', function (done) {
      /*eslint-disable*/
      var schema = {
        "description": "No resource found",
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string",
            "enum": [
              "RESOURCE_NOT_FOUND"
            ]
          },
          "message": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.get('/v1/candidate/5c9286a80000000000000000/basic-info')
        .set('Accept', 'application/json')
        .set('X-Request-Id', 'someRequestId')
        .set('x-request-jwt', jwtToken)
        .expect(404)
        .end(function (err, res) {
          if (err) {return done(err);}

          validator.validate(res.body, schema).should.be.true;
          done();
        });
    });

  });

});
