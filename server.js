const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
// Where the Flask backend lives (set in the systemd service on the server)
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.urlencoded({ extended: true }));

// Show the form
app.get("/", (req, res) => {
  res.render("index", { error: null, name: "", email: "" });
});

// Receive the form and forward it to the Flask backend
app.post("/submit", async (req, res) => {
  const { name, email } = req.body;
  try {
    const response = await fetch(`${BACKEND_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const result = await response.json();

    if (!response.ok) {
      return res.render("index", { error: result.error, name, email });
    }
    res.render("success", { result });
  } catch (err) {
    res.render("index", { error: `Could not reach backend: ${err.message}`, name, email });
  }
});

// Start the server only when this file is run directly (not when the tests import it)
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Frontend running on port ${PORT}, backend at ${BACKEND_URL}`);
  });
}

module.exports = app;
