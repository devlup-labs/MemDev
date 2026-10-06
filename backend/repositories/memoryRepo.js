import prisma from '../DB/prisma.js';

export async function findMemoryById(ID_memory, userId) { //used for insertion checking
    const memory = await prisma.memories.findUnique({
        where : {
            id: ID_memory
        }
    })

    if (!memory || memory.userId !== userId) {
        return null;
    }

    return memory;
}

export async function findMemoryForProcessing(memoryId) {
    return await prisma.memories.findUnique({
        where: {
            id: memoryId
        }
    });
}

export async function createMemory(memoryData) {
    const {
        id,
        userId,
        content,
        metadata,
        schemaVersion,
        userTitle,
        userNote,
        tags
    } = memoryData;

    return await prisma.memories.create({
        data: {
            id,
            userId,
            content,
            metadata,
            schemaVersion,
            userTitle,
            userNote,
            tags
        }
    });
}

export async function saveEmbedding(memoryId, embedding){
    const vector = `[${embedding.join(",")}]`; //convert into JS readable array from python

    await prisma.$executeRaw`
        UPDATE "Memories"
        SET
            embedding = ${vector}::vector,
            "modelVersion" = 'BAAI/bge-base-en-v1.5',
            "embeddingGeneratedAt" = CURRENT_TIMESTAMP
        WHERE id = ${memoryId}
    `;
}

export async function updateProcessingState(memoryId, state) {
    return await prisma.memories.update({
        where: {
            id: memoryId
        },
        data: {
            processingState: state
        }
    });
}

export async function saveSearchVector(memoryId) {
    await prisma.$executeRaw`
        UPDATE "Memories"
        SET "tsVectorTags" =
            to_tsvector(
                'simple',
                concat_ws(
                    ' ',
                    "userTitle",
                    "userNote",
                    content,
                    COALESCE(metadata->'context'->>'nearestHeading', ''),
                    array_to_string(tags, ' ')
                )
            ),
            "tsVectorTagsGeneratedAt" = CURRENT_TIMESTAMP
        WHERE id = ${memoryId}
    `;
}

export async function incrementRetryCount(memoryId) {
    return await prisma.memories.update({
        where: {
            id: memoryId
        },
        data: {
            retryCount: {
                increment: 1
            }
        }
    });
}

export async function resetRetryCount(memoryId) {
    return await prisma.memories.update({
        where: {
            id: memoryId
        },
        data: {
            retryCount: 0
        }
    });
}

//DASHBOARD BASED FUNCTIONS START FROM HERE

export async function getMemories(userId) {
    return prisma.memories.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 10
    });
}


export async function searchMemories(userId, query, queryEmbedding) { //SEARCH AND RETRIEVAL ALGORITHM
    const vector = `[${queryEmbedding.join(",")}]`;

    return prisma.$queryRaw`
        WITH lexical AS (
            SELECT
                id,
                ROW_NUMBER() OVER (
                    ORDER BY ts_rank_cd(
                        "tsVectorTags",
                        plainto_tsquery('simple', ${query})
                    ) DESC
                ) AS lexical_rank
            FROM "Memories"
            WHERE
                "userId" = ${userId}
                AND "processingState" = 'INDEXED'
                AND "tsVectorTags" IS NOT NULL
                AND "tsVectorTags" @@ plainto_tsquery('simple', ${query})
            LIMIT 20
        ),

        semantic AS (
            SELECT
                id,
                ROW_NUMBER() OVER (
                    ORDER BY embedding <=> ${vector}::vector
                ) AS semantic_rank
            FROM "Memories"
            WHERE
                "userId" = ${userId}
                AND "processingState" = 'INDEXED'
                AND embedding IS NOT NULL
            ORDER BY embedding <=> ${vector}::vector
            LIMIT 20
        ),

        combined AS (
            SELECT
                COALESCE(lexical.id, semantic.id) AS id,
                COALESCE(1.0 / (60 + lexical.lexical_rank), 0) +
                COALESCE(1.0 / (60 + semantic.semantic_rank), 0) AS score
            FROM lexical
            FULL OUTER JOIN semantic
                ON lexical.id = semantic.id
        )

        SELECT
            m.id,
            m."userId",
            m.content,
            m.metadata,
            m."schemaVersion",
            m."createdAt",
            m."updatedAt",
            m."userTitle",
            m."userNote",
            m.tags,
            m."processingState",
            m."retryCount",
            m."modelVersion",
            m."embeddingGeneratedAt",
            m."tsVectorTagsGeneratedAt",
            m."tsVectorTags"::text AS "tsVectorTags",
            combined.score
        FROM combined
        JOIN "Memories" m
            ON m.id = combined.id
        ORDER BY combined.score DESC
        LIMIT 10;
    `;
}

export async function updateMemory(memoryId, userId, updates) {
    const { userTitle, userNote, tags } = updates;

    const memory = await prisma.memories.findFirst({
        where: {
            id: memoryId,
            userId
        }
    });

    if (!memory) {
        return null;
    }

    return prisma.memories.update({
        where: {
            id: memoryId
        },
        data: {
            userTitle,
            userNote,
            tags
        }
    });
}