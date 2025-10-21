// src/app/api/memories/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { setMemory } from '@/lib/memory';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { memories } = body;

        if (!Array.isArray(memories)) {
            return NextResponse.json(
                { success: false, error: 'Invalid import format. Expected { memories: [...] }' },
                { status: 400 }
            );
        }

        let imported = 0;
        let failed = 0;

        for (const mem of memories) {
            try {
                if (mem.key && mem.value) {
                    setMemory({
                        key: mem.key,
                        value: mem.value,
                        who: mem.who || 'partner',
                        confidence: mem.confidence || 1.0,
                        source: 'imported'
                    });
                    imported++;
                } else {
                    failed++;
                }
            } catch (error) {
                console.error(`Failed to import ${mem.key}:`, error);
                failed++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Imported ${imported} memories, ${failed} failed`,
            imported,
            failed
        });
    } catch (error) {
        console.error('Error importing memories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to import memories' },
            { status: 500 }
        );
    }
}
