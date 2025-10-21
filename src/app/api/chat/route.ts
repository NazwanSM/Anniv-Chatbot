// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { callOllamaChat } from '@/lib/llm';
import { SYSTEM_PROMPT, toolDefs } from '@/lib/persona';
import { runTool } from '@/lib/tools';
import { setMemory } from '@/lib/memory';
import type { ChatMsg } from '@/core/types';

type Incoming = { messages: { role:'user'|'assistant'; text:string }[] };

// ===== INTENT HELPERS =====
function isCountdownQuestion(t: string) {
    const s = t.toLowerCase();
    return /(berapa.*hari.*(anniv|anniversary)|countdown)/i.test(s);
}
function isTimeQuestion(t: string) {
    const s = t.toLowerCase();
    return /(sekarang.*jam|hari ini tanggal|tanggal berapa|jam berapa)/i.test(s);
}
function isFactStatement(t: string) {
    const s = t.toLowerCase();
    // Deteksi pernyataan: "aku suka...", "favorit aku...", "tempat favorit aku...", dll
    return /(aku suka|favorit aku|kesukaan aku|tempat favorit|makanan favorit|minuman favorit|warna favorit|hobi aku)/i.test(s);
}

/**
 * Remove technical terms dari response
 */
function sanitizeResponse(text: string): string {
    // Remove common technical terms
    const technicalTerms = [
        /CallCheck\(\);?/gi,
        /call\s+(getMemory|setMemory|listMemories|getCurrentDateTime|getAnniversaryCountdown)/gi,
        /fungsi\s+(getMemory|setMemory)/gi,
        /\[System\s+calls?\s+\w+\]/gi,
        /\[.*?calls?\s+function.*?\]/gi,
        /<function_call>.*?<\/function_call>/gi,
    ];
    
    let sanitized = text;
    
    for (const term of technicalTerms) {
        sanitized = sanitized.replace(term, '');
    }
    
    // Clean up extra whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    
    return sanitized;
}

export async function POST(req: NextRequest) {
    const body: Incoming = await req.json();
    const { messages } = body;
    const lastUser = messages?.[messages.length - 1]?.text ?? '';

    // 2) COUNTDOWN langsung dari tool
    if (isCountdownQuestion(lastUser)) {
        const result = await runTool({ name: 'getAnniversaryCountdown', arguments: {} });
        
        if ('daysToAnniv' in result) {
            const { daysToAnniv: days, anniversary: anniv } = result;
            let reply: string;
            
            if (days === 0) {
                reply = `Hari ini anniversary kita! 🥳💖`;
            } else if (days === 1) {
                reply = `Besok anniversary kita sayang! 🎉✨`;
            } else {
                const [, month, day] = anniv.split('-');
                reply = `Menuju anniversary kita (${day}/${month}): tinggal ${days} hari lagi! 💕`;
            }
            
            return NextResponse.json({ reply });
        }
        
        return NextResponse.json({ reply: `Aku belum tahu tanggal anniversary kita. Kamu mau set tanggalnya? 🤔` });
    }

    // 3) PERTANYAAN WAKTU langsung dari tool
    if (isTimeQuestion(lastUser)) {
        const result = await runTool({ name: 'getCurrentDateTime', arguments: {} });
        if ('datetime_id' in result) {
            return NextResponse.json({ reply: `Sekarang di zona WIB: ${result.datetime_id}` });
        }
    }

    // ===== LLM FLOW =====
    const chat: ChatMsg[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.text }))
    ];
    
    // Tambahkan hint jika user menyebutkan preferensi
    if (isFactStatement(lastUser)) {
        chat.push({ 
            role: 'system', 
            content: 'HINT: User baru saja menyebutkan preferensi/fakta baru. Gunakan setMemory untuk menyimpan informasi ini.' 
        });
    }

    // Putaran 1
    const r1 = await callOllamaChat({
        model: process.env.LOVE_MODEL || 'qwen2.5:7b-instruct',
        messages: chat,
        tools: toolDefs
    });

    if (r1.tool_call) {
        // Jalankan tool dari permintaan model
        const toolResult = await runTool(r1.tool_call);
        // Putaran 2: kirim hasil tool
        const chatWithTool: ChatMsg[] = [
            ...chat,
            { role: 'tool', name: r1.tool_call.name, content: JSON.stringify(toolResult) }
        ];
        
        const r2 = await callOllamaChat({
            model: process.env.LOVE_MODEL || 'qwen2.5:7b-instruct',
            messages: chatWithTool,
            tools: toolDefs
        });

        // Persist fakta yang muncul
        r2.extracted_facts?.forEach(f => setMemory({
        key: f.key, value: f.value, source: 'model', who: 'partner', confidence: 0.95
        }));

        return NextResponse.json({ reply: r2.reply ?? '🤍' });
    }

    // Tanpa tool-call: tetap simpan facts dari tag (kalau ada)
    r1.extracted_facts?.forEach(f => setMemory({
        key: f.key, value: f.value, source: 'model', who: 'partner', confidence: 0.9
    }));

    // Setelah dapat response dari LLM
    let reply = r1.reply ?? '🤍';
    
    // Sanitize response
    reply = sanitizeResponse(reply);
    
    // Return sanitized response
    return NextResponse.json({ reply });
}
