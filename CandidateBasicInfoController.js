'use strict';

const CandidateBasicInfoService = require('../services/CandidateBasicInfoService');

/**
 * Gets the candidate basic information
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.getCandidateBasicInfo = function getCandidateBasicInfo(req, res, next) {
  let candidateBasicInfoService = new CandidateBasicInfoService(req.Logger, req.octophant);
  candidateBasicInfoService.getCandidateBasicInfo(req.swagger.params, res, next);
};

