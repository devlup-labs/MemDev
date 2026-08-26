import express from 'express';
import { postMemory } from './src/memorycontroller.js';

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello from the server");
});

app.post('/memories', postMemory);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});