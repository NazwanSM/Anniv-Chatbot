import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

// Tentukan lokasi DB via ENV, default ke ./data/memories.db
const DB_PATH = process.env.MEM_DB_PATH
  ? process.env.MEM_DB_PATH
  : path.join(process.cwd(), 'data', 'memories.db');

// Pastikan foldernya ada
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

let db: Database.Database | null = null;

// Lazy initialization - hanya dijalankan saat fungsi dipanggil
function getDb(): Database.Database {
    if (db) return db;
    
    // Initialize database
    const needsInit = !fs.existsSync(DB_PATH);
    db = new Database(DB_PATH);
    
    if (needsInit) {
        // Create new table with full schema
        db.exec(`
            CREATE TABLE memories (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                category TEXT DEFAULT 'general',
                who TEXT DEFAULT 'partner',
                confidence REAL DEFAULT 0.9,
                source TEXT DEFAULT 'chat',
                tags TEXT,
                importance INTEGER DEFAULT 1,
                updatedAt TEXT DEFAULT (datetime('now'))
            );
            
            CREATE INDEX idx_category ON memories(category);
            CREATE INDEX idx_who ON memories(who);
            CREATE INDEX idx_importance ON memories(importance);
        `);
    } else {
        // Migrate existing database if needed
        try {
            // Check if new columns exist
            const tableInfo = db.pragma('table_info(memories)');
                const columns = (tableInfo as Array<{ name: string }>).map(col => col.name);
            
            if (!columns.includes('category')) {
                db.exec(`ALTER TABLE memories ADD COLUMN category TEXT DEFAULT 'general'`);
            }
            if (!columns.includes('tags')) {
                db.exec(`ALTER TABLE memories ADD COLUMN tags TEXT`);
            }
            if (!columns.includes('importance')) {
                db.exec(`ALTER TABLE memories ADD COLUMN importance INTEGER DEFAULT 3`);
            }
            
            // Create indexes if they don't exist
            db.exec(`
                CREATE INDEX IF NOT EXISTS idx_category ON memories(category);
                CREATE INDEX IF NOT EXISTS idx_who ON memories(who);
                CREATE INDEX IF NOT EXISTS idx_importance ON memories(importance);
            `);
        } catch (error) {
            console.error('Migration error:', error);
        }
    }
    
    return db;
}

export type Fact = {
    key: string; 
    value: string; 
    category?: string;
    who?: string; 
    confidence?: number; 
    source?: string; 
    tags?: string;
    importance?: number;
    updatedAt?: string;
};

export type MemoryCategory = 
    | 'personal'           // Identitas personal
    | 'relationship'       // Detail hubungan
    | 'preferences'        // Preferensi & favorit
    | 'places'            // Tempat-tempat
    | 'emotional'         // Pola emosional
    | 'communication'     // Gaya komunikasi
    | 'inside_jokes'      // Inside jokes
    | 'special_moments'   // Momen spesial
    | 'goals'             // Goals & future plans
    | 'current_context'   // Context terkini
    | 'general';          // Umum

export function setMemory(rec: Fact) {
    const database = getDb();
    const now = new Date().toISOString();
    const stmt = database.prepare(`
        INSERT INTO memories(key, value, category, who, confidence, source, tags, importance, updatedAt)
        VALUES (@key, @value, @category, @who, @confidence, @source, @tags, @importance, @updatedAt)
        ON CONFLICT(key) DO UPDATE SET
        value=excluded.value, category=excluded.category, who=excluded.who, 
        confidence=excluded.confidence, source=excluded.source, tags=excluded.tags,
        importance=excluded.importance, updatedAt=excluded.updatedAt
    `);
    stmt.run({ 
        updatedAt: now, 
        category: 'general',
        who: 'partner', 
        confidence: 0.9, 
        source: 'chat',
        tags: null,
        importance: 1,
        ...rec 
    });
}

export function listMemoriesByCategory(category?: string): Fact[] {
    const database = getDb();
    if (category) {
        return database
            .prepare(`SELECT * FROM memories WHERE category = ? ORDER BY importance DESC, updatedAt DESC`)
            .all(category) as Fact[];
    }
    return listMemories();
}

export function searchMemories(query: string): Fact[] {
    const database = getDb();
    const searchTerm = `%${query}%`;
    return database
        .prepare(`SELECT * FROM memories WHERE key LIKE ? OR value LIKE ? OR tags LIKE ? ORDER BY importance DESC`)
        .all(searchTerm, searchTerm, searchTerm) as Fact[];
}

export function getMemory(key: string): Fact | null {
    const database = getDb();
    const row = database.prepare(`SELECT * FROM memories WHERE key = ?`).get(key);
    return row as Fact | null;
}

export function listMemories(): Fact[] {
    const database = getDb();
    return database.prepare(`SELECT * FROM memories ORDER BY updatedAt DESC`).all() as Fact[];
}
