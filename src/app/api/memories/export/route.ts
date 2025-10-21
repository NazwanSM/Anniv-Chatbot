// src/app/api/memories/export/route.ts
import { NextResponse } from 'next/server';
import { listMemories } from '@/lib/memory';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const memories = listMemories();
        
        // Format untuk export
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            memories: memories
        };

        return NextResponse.json(exportData, {
            headers: {
                'Content-Disposition': `attachment; filename="memories-${new Date().toISOString().slice(0, 10)}.json"`,
            }
        });
    } catch (error) {
        console.error('Error exporting memories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to export memories' },
            { status: 500 }
        );
    }
}
