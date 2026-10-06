import { createMemory, searchMemories, updateMemory } from '../services/memoryService.js';
import { getMemories, findMemoryById } from '../repositories/memoryRepo.js';

export async function postMemory(req, res) {
    try {
        const {
            memoryId, content, metadata, schemaVersion, userTitle, userNote, tags} = req.body;

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

        if (
            userTitle !== undefined &&
            typeof userTitle !== 'string'
        ) {
            return res.status(400).json({
                error: 'userTitle must be a string'
            });
        }

        if (
            userNote !== undefined &&
            typeof userNote !== 'string'
        ) {
            return res.status(400).json({
                error: 'userNote must be a string'
            });
        }

        if (
            tags !== undefined &&
            (
                !Array.isArray(tags) ||
                !tags.every(tag => typeof tag === 'string')
            )
        ) {
            return res.status(400).json({
                error: 'tags must be an array of strings'
            });
        }

        const memory = await createMemory(
            req.body,
            req.user.userId
        );

        return res.status(201).json({
            success: true,
            memory
        });

    } catch (error) {
        console.error('Failed to create memory:', error);

        return res.status(500).json({
            error: 'Failed to save memory'
        });
    }
}

export async function getMemoryList(req, res) {
    try {
        const memories = await getMemories(req.user.userId);

        return res.status(200).json({
            success: true,
            memories
        });

    } catch (error) {
        console.error("Failed to fetch memories:", error);

        return res.status(500).json({
            error: "Failed to fetch memories"
        });
    }
}

export async function getMemoryDetail(req, res) {
    try {
        const memory = await findMemoryById(
            req.params.id,
            req.user.userId
        );

        if (!memory) {
            return res.status(404).json({
                error: "Memory not found"
            });
        }

        return res.status(200).json({
            success: true,
            memory
        });

    } catch (error) {
        console.error("Failed to fetch memory:", error);

        return res.status(500).json({
            error: "Failed to fetch memory"
        });
    }
}

export async function searchMemory(req, res) {
    try {
        const { query } = req.body;

        if (typeof query !== 'string' || !query.trim()) {
            return res.status(400).json({
                error: "Search query is required"
            });
        }

        const memories = await searchMemories(
            query.trim(),
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            memories
        });

    } catch (error) {
        console.error("Failed to search memories:", error);

        return res.status(500).json({
            error: "Failed to search memories"
        });
    }
}

export async function updateMemoryDetail(req, res) {
    try {
        const { userTitle, userNote, tags } = req.body;

        if (
            userTitle !== undefined &&
            typeof userTitle !== "string"
        ) {
            return res.status(400).json({
                error: "userTitle must be a string"
            });
        }

        if (
            userNote !== undefined &&
            typeof userNote !== "string"
        ) {
            return res.status(400).json({
                error: "userNote must be a string"
            });
        }

        if (
            tags !== undefined &&
            (
                !Array.isArray(tags) ||
                !tags.every(tag => typeof tag === "string")
            )
        ) {
            return res.status(400).json({
                error: "tags must be an array of strings"
            });
        }

        if (
            userTitle === undefined &&
            userNote === undefined &&
            tags === undefined
        ) {
            return res.status(400).json({
                error: "No fields to update"
            });
        }

        const memory = await updateMemory(
            req.params.id,
            req.user.userId,
            {
                userTitle,
                userNote,
                tags
            }
        );

        if (!memory) {
            return res.status(404).json({
                error: "Memory not found"
            });
        }

        return res.status(200).json({
            success: true,
            memory
        });

    } catch (error) {
        console.error("Failed to update memory:", error);

        return res.status(500).json({
            error: "Failed to update memory"
        });
    }
}