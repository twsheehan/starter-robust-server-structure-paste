const express = require("express");
const morgan = require("morgan");
const app = express();
const pastes = require("./data/pastes-data");

// Application-level middleware
app.use(morgan("dev"));

// Route functions
app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next(`Paste id not found: ${PasteId}`);
  }
});

app.use("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
