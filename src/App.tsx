import { useState } from 'react';
import VideoTemplate from './components/video/VideoTemplate';

export default function App() {
  const [showCeremony, setShowCeremony] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const videoPath = `${import.meta.env.BASE_URL}videos/ziklag-class-of-2026-mobile.mp4`;

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(videoPath);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ziklag-graduation-2026.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(videoPath, '_blank');
    } finally {
      setDownloading(false);
    }
  }

  if (showCeremony) {
    return (
      <div className="relative w-full h-screen">
        <button
          onClick={() => setShowCeremony(false)}
          className="absolute top-4 left-4 z-[60] rounded-full px-5 py-2 font-semibold uppercase tracking-[0.12em] border border-[#d4af37]/70 text-[#f5e6a3] bg-[#0a0f2e]/80 hover:bg-[#d4af37]/15 transition"
        >
          ← Back
        </button>
        <VideoTemplate />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f2e] text-[#fff8e7] flex items-center justify-center p-6">
      <section className="w-full max-w-3xl rounded-3xl border border-[#d4af37]/40 bg-[#0f173f]/80 shadow-2xl p-8 md:p-12">
        <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-[#d4af37] text-center">Ziklag Class of 2026</p>
        <h1 className="mt-4 text-center font-display text-4xl md:text-6xl text-[#f5e6a3]">Graduation Ceremony</h1>
        <p className="mt-6 text-center text-base md:text-lg text-[#fff8e7]/85">
          Watch the ceremony online, or save a real MP4 video to your device — plays in QuickTime and on any phone.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:justify-center">
          <button
            onClick={() => setShowCeremony(true)}
            className="rounded-full px-6 py-4 font-semibold uppercase tracking-[0.12em] bg-[#d4af37] text-[#0a0f2e] hover:bg-[#e5c867] transition"
          >
            Watch Ceremony
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="rounded-full px-6 py-4 font-semibold uppercase tracking-[0.12em] border border-[#d4af37]/70 text-[#f5e6a3] hover:bg-[#d4af37]/15 transition disabled:opacity-50"
          >
            {downloading ? 'Saving…' : '⬇ Save Video to Device'}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-[#fff8e7]/40">
          MP4 · H.264 · AAC audio · 11 MB · QuickTime &amp; phone compatible
        </p>
      </section>
    </main>
  );
}
