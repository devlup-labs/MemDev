import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { randomUUID } from "node:crypto";
import prisma from "../DB/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || Buffer.byteLength(JWT_SECRET, "utf8") < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 bytes");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body ?? {};

        if (
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        const cleanUsername = username.trim();
        const cleanEmail = email.trim().toLowerCase();

        //not very useful stuff, just AI genned stuff, core logic remains human written
        if (cleanUsername.length < 2 || cleanUsername.length > 50) {
            return res.status(400).json({
                message: "Username must be between 2 and 50 characters"
            });
        }

        if (
            cleanEmail.length > 254 ||
            !EMAIL_REGEX.test(cleanEmail)
        ) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        if (
            password.length < 12
        ) {
            return res.status(400).json({
                message: "Password must be at least 12 characters"
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
            select: { id: true }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username: cleanUsername,
                email: cleanEmail,
                password: hashedPassword
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        return res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch (error) {
        // Handles duplicate-email races without exposing database details.
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body ?? {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        if (
            cleanEmail.length > 254 ||
            !EMAIL_REGEX.test(cleanEmail) ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                jti: randomUUID()
            },
            JWT_SECRET,
            {
                algorithm: "HS256",
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


const logout = async (req, res) => {
    try {
        await prisma.revokedToken.create({
            data: {
                id: req.user.jti,
                expiresAt: new Date(req.user.exp * 1000)
            }
        });

        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Could not complete logout"
        });
    }
};


export {
    signup,
    login,
    logout
};