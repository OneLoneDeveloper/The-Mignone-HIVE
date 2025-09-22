require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const contactRoutes = require("./routes/contact");

const app = express();

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main"); // default layout

// Static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", contactRoutes);

// Page routes
app.get("/", (req, res) => { res.render("pages/index", { title: "The Mignone HIVE" }); });
app.get("/programs", (req, res) => { res.render("pages/programs", { title: "Programs" }); });
app.get("/about", (req, res) => { res.render("pages/about", { title: "About Us" }); });
app.get("/contact", (req, res) => { res.render("pages/contact", { title: "Contact Us" }); });
app.get("/test", (req, res) => { res.render("pages/test", { title: "test Us" }); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`); });