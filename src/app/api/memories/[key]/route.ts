// src/app/api/memories/[key]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getMemory } from '@/lib/memory';
import Database from 'better-sqlite3';
import path from 'path';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Get specific memory
export async function GET(
    req: NextRequest,
    { params }: { params: { key: string } }
) {
    try {
        const memory = getMemory(params.key);
        
        if (!memory) {
            return NextResponse.json(
                { success: false, error: 'Memory not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: memory });
    } catch (error) {
        console.error('Error fetching memory:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch memory' },
            { status: 500 }
        );
    }
}

// DELETE - Delete memory
export async function DELETE(
    req: NextRequest,
    { params }: { params: { key: string } }
) {
    try {
        const dbPath = path.join(process.cwd(), 'memories.db');
        const db = new Database(dbPath);
        
        const result = db.prepare('DELETE FROM memories WHERE key = ?').run(params.key);
        db.close();

        if (result.changes === 0) {
            return NextResponse.json(
                { success: false, error: 'Memory not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Memory deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting memory:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete memory' },
            { status: 500 }
        );
    }
}
