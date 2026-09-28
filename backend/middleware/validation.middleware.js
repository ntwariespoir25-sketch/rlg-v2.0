const { validationResult } = require('express-validator');
const { ApiResponse } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  
  return ApiResponse.badRequest(res, 'Validation failed', extractedErrors);
};

module.exports = { validate };