import jwt from "jsonwebtoken";
import prisma from "../DB/prisma.js";

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authentication token required"
        });
    }

    const match = authHeader.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
        return res.status(401).json({
            message: "Authorization header must use Bearer"
        });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
        console.error("JWT_SECRET is missing or too short");
        return res.status(500).json({
            message: "Authentication is not configured"
        });
    }

    try {
        const decoded = jwt.verify(match[1], secret, {
            algorithms: ["HS256"]
        });

        if (
            typeof decoded !== "object" ||
            !decoded.userId ||
            !decoded.jti ||
            !decoded.exp
        ) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const revoked = await prisma.revokedToken.findUnique({
            where: { id: decoded.jti }
        });

        if (revoked) {
            return res.status(401).json({
                message: "Token has been revoked"
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError") {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        console.error("Authentication error:", error);
        return res.status(500).json({
            message: "Authentication service unavailable"
        });
    }
};

export default authenticateToken;