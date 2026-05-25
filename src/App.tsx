import { useState } from 'react';
import VideoTemplate from './components/video/VideoTemplate';

export default function App() {
  const [showCeremony, setShowCeremony] = useState(false);
  const downloadHref = `${import.meta.env.BASE_URL}videos/ziklag-class-of-2026-4k.mp4`;

  if (showCeremony) {
    return <VideoTemplate />;
  }

  return (
    <main className="min-h-screen bg-[#0a0f2e] text-[#fff8e7] flex items-center justify-center p-6">
      <section className="w-full max-w-3xl rounded-3xl border border-[#d4af37]/40 bg-[#0f173f]/80 shadow-2xl p-8 md:p-12">
        <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-[#d4af37] text-center">Ziklag Class of 2026</p>
        <h1 className="mt-4 text-center font-display text-4xl md:text-6xl text-[#f5e6a3]">Graduation Ceremony</h1>
        <p className="mt-6 text-center text-base md:text-lg text-[#fff8e7]/85">
          Welcome to the official ceremony page. Watch the full cinematic presentation or download the high-quality video file directly.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:justify-center">
          <button
            onClick={() => setShowCeremony(true)}
            className="rounded-full px-6 py-3 font-semibold uppercase tracking-[0.12em] bg-[#d4af37] text-[#0a0f2e] hover:bg-[#e5c867] transition"
          >
            Open Ceremony
          </button>
          <a
            href={downloadHref}
            download="ziklag-class-of-2026-4k.mp4"
            className="rounded-full px-6 py-3 font-semibold uppercase tracking-[0.12em] border border-[#d4af37]/70 text-[#f5e6a3] hover:bg-[#d4af37]/15 transition text-center"
          >
            Download Video (HD/4K)
          </a>
        </div>

        <p className="mt-6 text-center text-xs md:text-sm text-[#fff8e7]/60">
          If download does not start, ensure the file <code className="text-[#f5e6a3]">public/videos/ziklag-class-of-2026-4k.mp4</code> is uploaded to this deployment.
        </p>
      </section>
    </main>
  );
}
