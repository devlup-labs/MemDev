import express from 'express';
import dotenv from 'dotenv';

import prisma from './DB/prisma.js';

import authRoutes from './routes/authRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';

dotenv.config();

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/prisma-test', async (req, res) => {
    try {
        const result = await prisma.$queryRaw`SELECT 1 as test`;

        console.log(result);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.use('/auth', authRoutes);

app.use("/memories", memoryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});