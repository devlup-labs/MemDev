import express from 'express';
import { createMemory } from './src/memoryRepository.js';

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello from the server");
});

app.post('/memories', async (req, res) => {
    try {
        const { memoryId, content, metadata, schemaVersion } = req.body;

        if (
            typeof memoryId !== 'string' ||
            typeof content !== 'string' ||
            !content.trim() ||
            typeof metadata !== 'object' ||
            metadata === null ||
            typeof metadata.capture?.capturedAt !== 'string' ||
            typeof schemaVersion !== 'number'
        ) {
            return res.status(400).json({
                error: 'Invalid memory payload'
            });
        }

        const memory = await createMemory(req.body);

        res.status(201).json({
            success: true,
            memory
        });

    } catch (error) {
        console.error('Failed to create memory:', error);

        res.status(500).json({
            error: 'Failed to save memory'
        });
    }
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});