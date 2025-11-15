import express from "express";

const app = express();
const PORT = process.env.PORT || 1234;

// EJS + form parsing
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Serve the public form at "/"
app.use(express.static("public")); // serves public/index.html

// In-memory store (for this assignment)
const EDGES = [];
// Each record: { prevLower, nextDisplay, user, ts }

/**
 * Submit handler:
 * - Show ONLY other people's "next dreams" that share the same previous dream.
 * - Then save the current user's submission (so it appears for future visitors).
 */
app.post("/submit", (req, res) => {
  const prev = (req.body.prev || "").trim();
  const next = (req.body.next || "").trim();
  const user = (req.body.user || "anonymous").trim();

  if (!prev || !next) {
    return res.status(400).send("Please provide both: previous dream and next dream.");
  }

  const key = prev.toLowerCase();

  // 1) Gather other users' next steps for the same previous dream (exclude current submission)
  const others = EDGES
    .filter(e => e.prevLower === key)
    .slice()
    .reverse(); // newest first

  // 2) Save current submission (available for the next viewer)
  EDGES.push({
    prevLower: key,
    nextDisplay: next,
    user,
    ts: Date.now()
  });

  // 3) Render EJS result page with ONLY others' entries
  res.render("result", {
    centerPrev: prev,
    related: others
  });
});

// Health check (optional)
app.get("/health", (_req, res) => res.json({ ok: true, count: EDGES.length }));

app.listen(PORT, () => {
  console.log(`Dream app running at http://localhost:${PORT}`);
});
