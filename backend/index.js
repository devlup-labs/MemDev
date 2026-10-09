import express from 'express';
import dotenv from 'dotenv';

import prisma from './DB/prisma.js';

import authRoutes from './routes/authRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
    throw new Error(
        "JWT_SECRET must be configured with at least 32 bytes"
    );
}

const app = express();

const PORT = 3000;

app.use(express.json());

app.use('/auth', authRoutes);

app.use("/memories", memoryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});