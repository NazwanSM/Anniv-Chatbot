import Header from '@/components/Header';
import Card from '@/components/Card';

export default function Home() {
  return (
    <>
      <Header title="Love Chat" subtitle="A tiny place just for us" />
      <Card className="p-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Hi, my love 💖</h2>
        <p className="text-slate-600 mb-6">
          Ngobrol bareng Nazwan versi romantis yang inget hal-hal kecil tentang kamu.
        </p>
        <div className="flex gap-3 justify-center">
          <a href="/chat" className="px-5 py-2 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow hover:shadow-lg transition">
            Mulai Ngobrol
          </a>
          <a href="/memories" className="px-5 py-2 rounded-full bg-white/90 ring-1 ring-black/5 hover:bg-white transition">
            Lihat Memories
          </a>
        </div>
      </Card>
    </>
  );
}
