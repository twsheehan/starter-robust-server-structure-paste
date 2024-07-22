const express = require("express");
const morgan = require("morgan");
const app = express();
const pastes = require("./data/pastes-data");

// Add a `body` property to the request
app.use(express.json());

// Application-level middleware
app.use(morgan("dev"));

// Route functions
app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next({ status: 404, message: `Paste id not found: ${pasteId}` });
  }
});

app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    // No errors with request body, call next without error message.
    return next();
  }
  next({ status: 400, message: "A 'text' property is required." });
}

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", bodyHasTextProperty, (req, res) => {
  const { data: { name, syntax, exposure, expiration, text } = {} } = req.body;

  const newPaste = {
    id: ++lastPasteId, //Increment last ID, then assign as the current ID
    name,
    syntax,
    exposure,
    expiration,
    text,
  };
  pastes.push(newPaste);
  res.status(201).json({ data: newPaste });
});

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
