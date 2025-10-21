'use client';
import { motion } from 'framer-motion';

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <motion.div
        initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="mb-4"
        >
        <div className="flex items-center gap-3">
            <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 shadow-inner"/>
            <span className="absolute -right-0 -bottom-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
            </div>
            <div>
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
        </div>
        </motion.div>
    );
}
