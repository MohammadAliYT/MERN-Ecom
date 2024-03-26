class ErrorHandler extends Error {
  //The constructor method is called when you create a new instance of
  //the ErrorHandler class. It takes two parameters: message and statusCode.
  constructor(message, statusCode) {
    //super(message) calls the constructor of the parent class (Error) with the provided message.
    //This sets the error message of the ErrorHandler instance.
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
    //Error.captureStackTrace(this, this.constructor) captures a stack trace for the error.
    //This helps in debugging by providing information about where the error occurred in the code.
  }
}
module.exports = ErrorHandler;
