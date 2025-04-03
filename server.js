require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public")); // Pour les fichiers CSS et JS


// Test route
app.get("/", (req, res) => {
  res.render("index", { user: res.locals.user });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            res.locals.user = decoded;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});
