'use strict';

const CandidateBasicInfo = require('../models/CandidateBasicInfo');
const {RuntimeError, ResourceNotFoundError, ValidationError} = require('a24-node-error-utils');
const _ = require('lodash');
const {getTitle} = require('a24-node-title-utils');

class CandidateBasicInfoService {

  constructor(logger, auditor) {
    this.logger = logger;
    this.auditor = auditor;
  }

  /**
   * Method to gets the candidate basic information
   *
   * @param {Object} swaggerParams - The request arguments passed in from the controller
   * @param {ResponseMessage} res - The http response object
   * @param {Function} next - The callback used to pass control to the next action/middleware
   *
   * @return void
   */
  getCandidateBasicInfo(swaggerParams, res, next) {
    let candidateId = swaggerParams.candidate_id.value;

    CandidateBasicInfo.findOne({'candidate_id': candidateId}, (findError, result) => {
      if (findError) {
        let runTimeError = new RuntimeError(
          'An error occurred while finding basic information for the candidate [' + candidateId + ']',
          findError
        );
        return next(runTimeError);
      }
      res.setHeader('Content-Type', 'application/json');

      if (_.isEmpty(result)) {
        let resourceNotFound = new ResourceNotFoundError(
          'No basic information found for the candidate with Id [' + candidateId + ']'
        );
        return next(resourceNotFound);
      }
      res.statusCode = 200;
      this.logger.info(
        'The get call to candidate basic information has been completed successfully'
      );

      let loggerObj = {
        logger: this.logger,
        message: 'Audit failed for getCandidateBasicInfo event.'
      };
      return doAuditAndRespond(loggerObj, this.auditor, res, result);
    });
  }
}

module.exports = CandidateBasicInfoService;

/**
 * Creates a default audit and ends the response.
 *
 * @param {Object} loggerObj - Instance of a logger and a message
 * @param {Auditor} auditor - Instance of auditor
 * @param {IncomingMessage} res - The http response object
 * @param {Object} responseObject - The response to return to user
 *
 * @private
 */
function doAuditAndRespond(loggerObj, auditor, res, responseObject) {
  let candidateId = responseObject.candidate_id;
  auditor.doAudit('candidate', candidateId, (err) => {
    if (err) {
      loggerObj.logger.crit(
        loggerObj.message,
        {
          candidate_id: candidateId,
          original_error: err
        }
      );
    }
    res.end(JSON.stringify(responseObject));
  });
}
