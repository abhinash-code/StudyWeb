const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Public folder ko static serve karo
app.use(express.static(path.join(__dirname, "public")));

// Agar root (/) par request aaye to index.html bhejna
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Document Manager running at http://localhost:${PORT}`);
});
