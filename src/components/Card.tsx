import { ReactNode } from 'react';

export default function Card({ children, className="" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl backdrop-blur-xl bg-white/70 shadow-sm ring-1 ring-black/5 ${className}`}>
        {children}
        </div>
    );
}