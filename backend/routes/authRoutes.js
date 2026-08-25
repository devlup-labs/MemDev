const express = require("express");

const router = express.Router();

const { signup, login } = require("../controllers/authControllers");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/signup", signup);

router.post("/login", login);

router.get("/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        user: req.user
    });
});

module.exports = router;