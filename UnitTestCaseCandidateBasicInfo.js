'use strict';

const {expect, assert} = require('chai');
const sinon = require('sinon');
const CandidateBasicInfoService = require('../../services/CandidateBasicInfoService');
const CandidateBasicInfo = require('../../models/CandidateBasicInfo');
const {RuntimeError, ValidationError, ResourceNotFoundError} = require('error-utils');
const {RuntimeErrorAssert} = require('nodetestutils');

let auditor = {
  getAuditor(auditSpy) {
    return {
      doAudit: auditSpy
    };
  }
};

let logger = {
  getLogger: function logger(logSpy) {
    return {'debug': logSpy, 'error': logSpy, 'info': logSpy, 'crit': logSpy};
  }
};

describe('CandidateBasicInfoService test scenarios', function () {

  describe('getCandidateBasicInfo(): Gets the candidate basic info', function () {

    /**
     * Test that a 200 response code is returned with data
     *
     * @covers services/CandidateBasicInfoService.getCandidateBasicInfo
     * @covers services/CandidateBasicInfoService.doAuditAndRespond
     */
    it('200 response test', function (done) {
      let candidateId = 'SomeCandidateId';
      let swaggerParams = {
        candidate_id: {
          value: candidateId
        }
      };

      let expectedResponse = new CandidateBasicInfo({
        'candidate_id': candidateId,
        'first_name': 'Joe',
        'last_name': 'Johny',
        'gender': 'male',
        'date_of_birth': '1990-05-12T00:00:00.000+0000',
        'title': 'mr'
      });

      let expectedQuery = {'candidate_id': candidateId};
      let candidateBasicInfoFind = new sinon.stub(CandidateBasicInfo, 'findOne');
      candidateBasicInfoFind.callsFake((query, callback) => {
        assert.deepEqual(
          query,
          expectedQuery,
          'Query do not match'
        );
        callback(null, expectedResponse);
      });

      let logSpy = sinon.spy();
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let auditorSpy = sinon.spy(function (code, actualCandidateId, callback) {
        assert.equal(code, 'candidate', 'Unexpected code supplied for auditing');
        assert.equal(actualCandidateId, candidateId, 'Incorrect ID supplied for auditing');
        callback();
      });

      let auditorInst = auditor.getAuditor(auditorSpy);

      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(logSpy.callCount, 1);
        assert.equal(nextSpy.callCount, 0);
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(expectedResponse), 'The response body does not match');
        candidateBasicInfoFind.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };

      let candidateBasicInfoService = new CandidateBasicInfoService(logger.getLogger(logSpy), auditorInst);
      candidateBasicInfoService.getCandidateBasicInfo(swaggerParams, res, nextSpy);
    });
  }
}
