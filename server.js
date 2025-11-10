// server.js
const express = require("express");
const path = require("path");
const app = express();

// Parse form fields from POST bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files (our index.html lives in /public)
app.use(express.static(path.join(__dirname, "public")));

// GET: show the form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "upload.html"));
});

// POST: handle the form and return a simple HTML page
app.post("/submit", (req, res) => {
  const { name = "friend", mood = "great", emoji = "🙂" } = req.body;
  const escape = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
    })[c]);

  const message = `Hi ${escape(name)} — you’re doing ${escape(mood)} today ${escape(emoji)}!`;

  res.send(`<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>Your Compliment</title>
      <style>
        body { font-family: system-ui, -apple-system, Segoe UI, Arial, sans-serif; margin: 4rem; }
        .card { max-width: 640px; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,.08); }
        h1 { margin-top: 0; }
        a { display: inline-block; margin-top: 1rem; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>${message}</h1>
        <p>Want another one?</p>
        <a href="/">← Go back</a>
      </div>
    </body>
  </html>`);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
