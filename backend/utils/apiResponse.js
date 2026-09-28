class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
  
  static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
    };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }
  
  static badRequest(res, message = 'Bad Request', errors = null) {
    return this.error(res, message, 400, errors);
  }
  
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }
  
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }
  
  static notFound(res, message = 'Not Found') {
    return this.error(res, message, 404);
  }
  
  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }
}

module.exports = { ApiResponse };