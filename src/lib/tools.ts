import { getMemory as dbGet, setMemory as dbSet, listMemories as dbList, searchMemories, Fact } from './memory';

// Centralized key mapping function
export function mapQueryToKey(q: string) {
    const s = q.toLowerCase();
    // preferences
    if (s.includes('makan') || s.includes('food')) return 'favorite_food';
    if (s.includes('minum') || s.includes('drink') || s.includes('coffee') || s.includes('kopi')) return 'favorite_drink';
    if (s.includes('warna') || s.includes('color')) return 'favorite_color';
    // birthdays
    if (/(ulang\s*tahun|birthday|tanggal\s*lahir|tgl\s*lahir|dob)/.test(s)) {
        // let runTool decide who (partner vs self)
        return 'misc';
    }
    // anniversary
    if (
        s.includes('anniv') || s.includes('anniversary') ||
        (s.includes('tanggal') && (s.includes('jadian') || s.includes('pacaran'))) ||
        (s.includes('kapan') && (s.includes('anniv') || s.includes('jadian')))
    ) return 'anniversary_date';
    // places & hobbies
    if (s.includes('tempat') || s.includes('place') || s.includes('lokasi')) return 'place_fav';
    if (s.includes('hobi') || s.includes('hobby')) return 'hobby_fav';
    return 'misc';
}

// Tool result types
export type ToolResult = 
    | { key: string; value: string | null }
    | { ok: boolean }
    | { items: Fact[] }
    | { datetime_id: string }
    | { anniversary: string; daysToAnniv: number }
    | { error: string };

// Calculate days until next anniversary
function calculateAnniversaryCountdown(anniversaryDateStr: string): { anniversary: string; daysToAnniv: number } {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Parse the anniversary date (format: YYYY-MM-DD)
    const [, month, day] = anniversaryDateStr.split('-').map(Number);
    
    // Create anniversary date for current year
    let nextAnniv = new Date(currentYear, month - 1, day);
    
    // If anniversary already passed this year, use next year
    if (nextAnniv < now) {
        nextAnniv = new Date(currentYear + 1, month - 1, day);
    }
    
    // Calculate days difference
    const diffTime = nextAnniv.getTime() - now.getTime();
    const daysToAnniv = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return { anniversary: anniversaryDateStr, daysToAnniv };
}

export async function runTool(tc: { name: string; arguments: Record<string, unknown> }): Promise<ToolResult> {
    try {
        switch (tc.name) {
            case 'getMemory': {
                const query = tc.arguments.query;
                if (typeof query !== 'string') {
                    return { error: 'query must be a string' };
                }
                const q = query.toLowerCase();

                // Helper: infer birthday key from pronouns
                const inferBirthdayKey = (): string => {
                    const partnerHints = ['kamu', 'pasya', 'dia', 'pacar', 'cewek', 'girlfriend', 'her', 'his'];
                    const selfHints = ['aku', 'saya', 'gue', 'my'];
                    if (partnerHints.some(h => q.includes(h))) return 'partner_birthday';
                    if (selfHints.some(h => q.includes(h))) return 'your_birthday';
                    return 'partner_birthday'; // default assume partner
                };

                // Primary mapping
                let key = mapQueryToKey(query);

                // Birthday detection if mapping is misc or query explicitly mentions birthday
                const mentionsBirthday = /(ulang\s*tahun|birthday|tgl\s*lahir|tanggal\s*lahir|dob)/i.test(q);
                if (key === 'misc' && mentionsBirthday) {
                    key = inferBirthdayKey();
                }

                // Try direct key first
                let rec = key !== 'misc' ? dbGet(key) : null;

                // Fallbacks for birthday
                if ((!rec || !rec.value) && mentionsBirthday) {
                    const candidates = [inferBirthdayKey(), 'partner_birthday', 'your_birthday', 'birthday', 'ulang_tahun', 'tanggal_lahir', 'dob'];
                    for (const cand of candidates) {
                        const r = dbGet(cand);
                        if (r?.value) { rec = r; key = cand; break; }
                    }
                    // Last resort: search by keywords
                    if (!rec || !rec.value) {
                        const hits = [
                            ...searchMemories('birthday'),
                            ...searchMemories('ulang'),
                            ...searchMemories('lahir')
                        ];
                        const found = hits.find(h => /birthday|ulang|lahir/.test(h.key) || /birthday|ulang|lahir/i.test(h.tags || ''));
                        if (found) { rec = found; key = found.key; }
                    }
                }

                // If still not found and not birthday, just return mapped key and null
                return { key, value: rec?.value ?? null };
            }
            case 'setMemory': {
                const { key, value } = tc.arguments;
                if (typeof key !== 'string' || typeof value !== 'string') {
                    return { error: 'key and value must be strings' };
                }
                dbSet({ key, value, who: 'partner', confidence: 0.95, source: 'chat' });
                return { ok: true };
            }
            case 'listMemories': {
                return { items: dbList() };
            }
            case 'getCurrentDateTime': {
                const dt = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
                return { datetime_id: dt };
            }
            case 'getAnniversaryCountdown': {
                // Prefer from DB if in ISO format
                const dbAnniv = dbGet('anniversary_date');
                const val = dbAnniv?.value?.trim();
                const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
                const anniv = (val && ISO_RE.test(val))
                    ? val
                    : (process.env.ANNIV_DATE || '2022-10-22');
                return calculateAnniversaryCountdown(anniv);
            }
            default:
                return { error: 'unknown_tool' };
        }
    } catch (error) {
        console.error('Tool execution error:', error);
        return { error: error instanceof Error ? error.message : 'unknown_error' };
    }
}
