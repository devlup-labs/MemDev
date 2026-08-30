import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';

dotenv.config();

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello from the server");
});

app.use('/auth', authRoutes);

app.use("/memories", memoryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});