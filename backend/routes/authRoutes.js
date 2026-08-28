import express from "express";

import { signup, login } from "../controllers/authControllers.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/signup", signup);

router.post("/login", login);

router.get("/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        user: req.user
    });
});

export default router;