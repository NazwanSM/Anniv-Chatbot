// src/lib/llm.ts
import type { ChatMsg } from '@/core/types';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// --- FACT parsing (tahan newline & spasi) ---
const FACT_RE = /<fact\s+key="([^"]+)">([\s\S]*?)<\/fact>/g;

function extractFacts(text?: string) {
    if (!text) return [] as { key: string; value: string }[];
    const facts: { key: string; value: string }[] = [];
    let m: RegExpExecArray | null;
    while ((m = FACT_RE.exec(text))) {
        facts.push({ key: m[1], value: m[2].trim() });
    }
    return facts;
}

export function stripFactTags(text: string) {
    return text.replace(FACT_RE, '').replace(/\n{3,}/g, '\n\n').trim();
}

// --- Panggil Ollama Chat (dengan tools) ---
export async function callOllamaChat({
    model,
    messages,
    tools
}: {
    model: string;
    messages: ChatMsg[];
    tools?: unknown[];
}) {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model,
            messages: messages.map(m => ({ 
                role: m.role, 
                content: m.content, 
                name: m.name 
            })),
            tools,
            tool_choice: 'auto',
            stream: false,
            options: { temperature: 0.6 }
        })
    });

    const data = await res.json();
    const msg = data?.message ?? data;
    const raw = msg?.content ?? '';

    // ambil tool_call pertama (jika ada)
    let tool_call: { name: string; arguments: Record<string, unknown> } | null = null;
    const tc = msg?.tool_calls?.[0];
    if (tc?.function?.name) {
        try {
            tool_call = {
                name: tc.function.name,
                arguments: typeof tc.function.arguments === 'string'
                    ? JSON.parse(tc.function.arguments || '{}')
                    : (tc.function.arguments ?? {})
            };
        } catch {
            tool_call = { name: tc.function.name, arguments: {} };
        }
    }

    // ekstrak & sembunyikan tag <fact>
    const extracted_facts = extractFacts(raw);
    const reply = stripFactTags(raw);

    return { reply, tool_call, extracted_facts };
}
