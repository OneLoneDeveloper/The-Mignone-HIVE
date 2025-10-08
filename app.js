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

// Parse form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API routes
app.use("/api", contactRoutes);

// Page routes
app.get("/", (req, res) => { res.render("pages/index", { title: "The Mignone HIVE", description: "Discover The Mignone HIVE: a creative learning community with workshops, classes, and more." }); });
app.get("/programs", (req, res) => { res.render("pages/programs", { title: "Programs", description: "Explore our programs and classes designed for learners of all ages." }); });
app.get("/about", (req, res) => { res.render("pages/about", { title: "About Us", description: "Learn about the story and mission behind The Mignone HIVE." }); });
app.get("/contact", (req, res) => { res.render("pages/contact", { title: "Contact Us", description: "Get in touch with The Mignone HIVE team for inquiries, partnerships, and support." }); });


app.get('/resources/area-perimeter', (req, res) => {
  res.render('pages/app-area-perimeter', {
    title: 'Area & Perimeter Playground',
    description: 'Interactive rectangle to explore area and perimeter.',
  });
});

// Wrong turn
app.use((req, res) => { res.status(404).render("pages/404", { title: "Page Not Found", description: "Sorry, this page does not exist..." }); });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`); });