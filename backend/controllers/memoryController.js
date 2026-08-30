import { createMemory } from '../services/memoryService.js';

export async function postMemory(req, res) {
    try {
        const { memoryId, content, metadata, schemaVersion } = req.body; //destructuring the incoming JSON

        if (
            typeof memoryId !== 'string' ||
            typeof content !== 'string' ||
            !content.trim() ||
            typeof metadata !== 'object' ||
            metadata === null ||
            typeof metadata.context !== 'object' ||
            metadata.context === null ||
            typeof metadata.capture?.capturedAt !== 'string' ||
            typeof schemaVersion !== 'number'
        ) {
            return res.status(400).json({
                error: 'Invalid memory payload'
            });
        }

        const memory = await createMemory(req.body, req.user.userId);  //for pairing it up with auth, and passing whole request

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
}