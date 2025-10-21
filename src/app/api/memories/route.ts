// src/app/api/memories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listMemories, setMemory, getMemory } from '@/lib/memory';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - List all memories
export async function GET() {
    try {
        const memories = listMemories();
        return NextResponse.json({ success: true, data: memories });
    } catch (error) {
        console.error('Error fetching memories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch memories' },
            { status: 500 }
        );
    }
}

// POST - Add or update memory
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { key, value, category, who, confidence, source, tags, importance } = body;

        if (!key || !value) {
            return NextResponse.json(
                { success: false, error: 'Key and value are required' },
                { status: 400 }
            );
        }

        // Validate key format (alphanumeric and underscore only)
        if (!/^[a-z0-9_]+$/.test(key)) {
            return NextResponse.json(
                { success: false, error: 'Key must be lowercase alphanumeric with underscores only' },
                { status: 400 }
            );
        }

        setMemory({
            key,
            value,
            category: category || 'general',
            who: who || 'partner',
            confidence: confidence || 1.0,
            source: source || 'manual',
            tags: tags || null,
            importance: importance || 1
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Memory saved successfully',
            data: getMemory(key)
        });
    } catch (error) {
        console.error('Error saving memory:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save memory' },
            { status: 500 }
        );
    }
}
