const ErrorHandle = require("../utils/errorHandler");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong mongodb id error handling
  if (err.name === "CastError") {
    const message = `Resource not found, Invalid : ${err.path}`;
    err = new ErrorHandle(message, 400);
  }
  // Custom error handling for price validation
  if (err.name === "ValidationError" && err.errors["price"]) {
    const message = err.errors["price"].message;
  } else if (err.name === "ValidationError" && err.errors["price"] <= 0) {
    const message = "Price cannot be less than zero";
    err = new ErrorHandle(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
