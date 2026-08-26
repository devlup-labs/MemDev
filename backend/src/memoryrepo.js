import pool from './db.js';

export async function createMemory(memory) {
    const {
        memoryId,
        content,
        metadata,
        schemaVersion
    } = memory;

    const source = metadata.source || {};
    const capture = metadata.capture || {};
    const user = metadata.user || {};
    const context = metadata.context || null;

    const query = `
        INSERT INTO memories (
            memory_id,
            content,
            source_url,
            source_title,
            source_domain,
            captured_at,
            user_title,
            user_note,
            tags,
            context,
            schema_version
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10, $11
        )
        ON CONFLICT (memory_id)
        DO UPDATE SET
            updated_at = NOW()
        RETURNING *
    `;

    const values = [
        memoryId,
        content,
        source.url || null,
        source.title || null,
        source.domain || null,
        capture.capturedAt,
        user.title || null,
        user.note || null,
        user.tags || [],
        context,
        schemaVersion
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}