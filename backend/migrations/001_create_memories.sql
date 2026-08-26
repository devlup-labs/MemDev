CREATE TABLE memories (
    memory_id UUID PRIMARY KEY,
    
    user_id INTEGER,
    content TEXT NOT NULL,
    source_url TEXT,
    source_title TEXT,
    source_domain TEXT,
    captured_at TIMESTAMPTZ NOT NULL,
    
    user_title TEXT,
    user_note TEXT,
    tags TEXT[],
    
    context JSONB,
    
    schema_version INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);