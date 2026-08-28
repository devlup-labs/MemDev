import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import authenticateToken from './middleware/authMiddleware.js';
import { postMemory } from './src/memoryController.js';

dotenv.config();

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello from the server");
});

app.use('/auth', authRoutes);

app.post('/memories', authenticateToken, postMemory);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});