'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Card from '@/components/Card';

type Msg = { role:'user'|'assistant'; text:string };

export default function ChatPage() {
    const [messages, setMessages] = useState<Msg[]>([
        { role:'assistant', text:'Ewooo sayangkuww ✨ Aku di sini. Mau cerita apa hari ini?' }
    ]);
    const [val, setVal] = useState('');
    const [loading, setLoading] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, loading]);

    const send = async () => {
        if (!val.trim()) return;
        const userMsg: Msg = { role: 'user', text: val.trim() };
        const next: Msg[] = [...messages, userMsg];
        setMessages(next); 
        setVal(''); 
        setLoading(true);
        
        const res = await fetch('/api/chat', {
            method:'POST', 
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ messages: next })
        });
        const data = await res.json();
        const assistantMsg: Msg = { role: 'assistant', text: data.reply };
        setMessages([...next, assistantMsg]);
        setLoading(false);
    };

    const quick = (s: string) => setVal(s);

    return (
        <>
        <Header title="Chatbot Nazwan" subtitle="Nazwan • always here for you" />
        <Card className="p-3">
            {/* viewport */}
            <div ref={viewportRef} className="h-[62vh] overflow-y-auto pr-1">
            <div className="px-1 pt-1 pb-3 space-y-3">
                <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                    <motion.div
                    key={i}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type:'spring', stiffness: 120, damping: 16 }}
                    className={`flex ${m.role==='assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                    <div className={`
                        max-w-[78%] leading-relaxed text-[15px]
                        px-4 py-2 rounded-2xl shadow-sm ring-1
                        ${m.role==='assistant'
                        ? 'bg-white/90 ring-black/5'
                        : 'bg-gradient-to-br from-pink-500 to-purple-500 text-white ring-black/0'}
                        ${m.role==='assistant' ? 'rounded-bl-md' : 'rounded-br-md'}
                    `}>
                        {m.text}
                    </div>
                    </motion.div>
                ))}
                {loading && (
                    <motion.div
                    key="typing"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex justify-start"
                    >
                    <div className="px-4 py-2 rounded-2xl bg-white/90 ring-1 ring-black/5 shadow-sm">
                        <span className="inline-flex items-center gap-1 text-slate-500">
                        <i className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                        <i className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-150" />
                        <i className="h-2 w-2 rounded-full bg-slate-400 animate-pulse delay-300" />
                        </span>
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
            </div>

            {/* composer */}
            <div className="flex items-center gap-2">
            <div className="flex-1 rounded-full bg-white/90 ring-1 ring-black/5 px-4 py-2 shadow-sm focus-within:ring-pink-300 transition">
                <input
                value={val} onChange={e=>setVal(e.target.value)}
                onKeyDown={e=>e.key==='Enter' && send()}
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
                placeholder="Tulis sesuatu yang manis…"
                />
            </div>
            <button
                onClick={send}
                className="rounded-full px-4 py-2 bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-md hover:shadow-lg active:scale-[.98] transition"
                aria-label="Kirim"
            >
                Kirim
            </button>
            </div>
        </Card>

        {/* footer small */}
        <div className="mt-3 text-center text-xs text-slate-500">
            Bot ini masih blom bisa jadi Nazwan sepenuhnya, 
            tapi tenang aja kamu udah punya yang aslinya. 🤍
        </div>
        </>
    );
}
