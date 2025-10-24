import './globals.css';

export const metadata = { title: 'AnnivBot 3.0', description: 'For us 💖' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className="h-full bg-gradient-to-b from-rose-50 to-white text-slate-800 antialiased">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          {/* soft vignette + subtle pattern */}
          <div className="absolute inset-0 opacity-60" style={{
            background: `radial-gradient(60% 40% at 50% 0%, rgba(252, 231, 243, .7) 0%, transparent 60%)`
          }} />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(#f5e1ec 1px, transparent 1px)`,
            backgroundSize: '18px 18px',
            opacity: .15
          }}/>
        </div>
        <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
          <div className="w-full max-w-md sm:max-w-lg">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
