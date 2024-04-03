const app = require("./app");
const dotenv = require("dotenv").config();
const connectDatabase = require("./database/dbConnect");
//connect database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log("CORS enabled");
  console.log(`listening on port http://localhost:${process.env.PORT}`);
});

//Uncaught Exception Handler
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise resejction");
  server.close(() => {
    process.exit(1);
  });
});

//Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise resejction");
  server.close(() => {
    process.exit(1);
  });
});
