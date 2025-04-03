const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

const users = [];

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Accès non autorisé" });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalide" });
    }
};

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    if (users.find((u) => u.username === username)) {
        return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: "Utilisateur inscrit avec succès" });
});

router.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Identifiants incorrects" });
    }

    // Générer un token JWT
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" });

    // Stocker le token dans un cookie sécurisé
    res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 3600000 });

    res.json({ message: "Connexion réussie" });
});

router.get("/profile", verifyToken, (req, res) => {
    res.json({ message: `Bienvenue, ${req.user.username}` });
});


router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Déconnexion réussie" });
});

module.exports = router;
