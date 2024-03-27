const ErrorHandler = require("../utils/errorHandler");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong mongodb id error handling
  if (err.name === "CastError") {
    const message = `Resource not found, Invalid : ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // Custom error handling for price validation
  if (err.name === "ValidationError") {
    const errorFields = Object.keys(err.errors);
    const errorMessages = [];

    errorFields.forEach((field) => {
      if (field.includes(".")) {
        const [arrayField, index, subField] = field.split(".");
        if (
          subField === "minQuantity" ||
          subField === "maxQuantity" ||
          subField === "price"
        ) {
          const errorMessage = `At ${arrayField}[${index}], ${err.errors[field].message}`;
          errorMessages.push(errorMessage);
        }
      }
    });

    if (errorMessages.length > 0) {
      const message = errorMessages.join("; "); // Join error messages with a separator
      err = new ErrorHandler(message, 400);
    }
  }

  if (err.code === 11000) {
    //Mongoose duplicate key error
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
