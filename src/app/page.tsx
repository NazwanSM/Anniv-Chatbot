import Header from '@/components/Header';
import Card from '@/components/Card';

export default function Home() {
  return (
    <>
      <Header title="AnnivBot 3.0" subtitle="A tiny place just for us" />
      <Card className="p-4 sm:p-6 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2">Haloo, sayangkuu 💖</h2>
        <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
          Ngobrol bareng Nazwan versi bot yang selalu ada untukmu.
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          <a href="/chat" className="px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow hover:shadow-lg transition">
            Mulai Ngobrol
          </a>
          <a href="/memories" className="px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base bg-white/90 ring-1 ring-black/5 hover:bg-white transition">
            Lihat Memories
          </a>
          <a href="/anniversary" className="px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base bg-gradient-to-br from-pink-400 via-red-400 to-pink-500 text-white shadow hover:shadow-lg transition">
            💕 Ucapan Anniversary
          </a>
        </div>
      </Card>
    </>
  );
}
