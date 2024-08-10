import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Set the port
const PORT = process.env.PORT || 3000;

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to check if the request is within working hours
const checkWorkingHours = (req, res, next) => {
  const now = new Date();
  const day = now.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const hour = now.getHours();

  // Check if it is Monday to Friday and between 9 to 17
  if (day >= 1 && day <= 5 && hour >= 9 && hour <= 17) {
    next();
  } else {
    res
      .status(403)
      .send(
        "Service is only available during working hours (Monday to Friday, 9 to 5)."
      );
  }
};

// Apply the middleware
app.use(checkWorkingHours);

// Define routes
app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/services", (req, res) => {
  res.render("services");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
