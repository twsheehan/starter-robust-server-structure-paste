const usersRouter = require("./users/users.router");
const pastesRouter = require("./pastes/pastes.router");
const express = require("express");
const morgan = require("morgan");
const app = express();

// Add a `body` property to the request
app.use(express.json());

// Application-level middleware
app.use(morgan("dev"));

// Route functions
app.use("/users", usersRouter);
app.use("/pastes", pastesRouter);

// Not found handler
app.use((req, res, next) => {
  next(`Not found: ${req.originalUrl}`);
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
