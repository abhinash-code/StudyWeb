const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (tumhare HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Contact form submit route
app.post("/submit-form", (req, res) => {
  const formData = req.body;

  // File path jaha save karna hai
  const filePath = path.join(__dirname, "submissions.json");

  // Purane data read karke add karna
  let existingData = [];
  if (fs.existsSync(filePath)) {
    existingData = JSON.parse(fs.readFileSync(filePath));
  }
  existingData.push(formData);

  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  res.json({ success: true, message: "Form submitted successfully!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
