import { useState } from 'react';
import VideoTemplate from './components/video/VideoTemplate';

function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export default function App() {
  const [showCeremony, setShowCeremony] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const videoPath = `${import.meta.env.BASE_URL}videos/ziklag-class-of-2026-mobile.mp4`;

  async function handleDownload() {
    if (isIOS()) {
      setIosHint(true);
      window.open(videoPath + '?v=180', '_blank');
      return;
    }

    setDownloading(true);
    try {
      const res = await fetch(videoPath + '?v=180', { cache: 'no-store' });
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
      <div className="relative w-full h-screen bg-[#0a0f2e]">
        <button
          onClick={() => setShowCeremony(false)}
          className="absolute top-4 left-4 z-[60] rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] border border-[#d4af37]/70 text-[#f5e6a3] bg-[#0a0f2e]/80 hover:bg-[#d4af37]/15 transition"
        >
          ← Back
        </button>
        <VideoTemplate />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f2e] text-[#fff8e7] flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#d4af37]">
            Ziklag Class of 2026
          </p>
          <h1 className="font-display text-4xl text-[#f5e6a3] leading-tight">
            Graduation<br />Ceremony
          </h1>
          <p className="mt-1 text-sm text-[#fff8e7]/70 leading-relaxed">
            Watch the live ceremony, or save the video straight to your phone.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <button
            onClick={() => setShowCeremony(true)}
            className="w-full rounded-2xl px-6 py-4 font-semibold uppercase tracking-[0.12em] bg-[#d4af37] text-[#0a0f2e] hover:bg-[#e5c867] active:scale-95 transition text-sm"
          >
            ▶ Watch Ceremony
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full rounded-2xl px-6 py-4 font-semibold uppercase tracking-[0.12em] border border-[#d4af37]/70 text-[#f5e6a3] hover:bg-[#d4af37]/10 active:scale-95 transition disabled:opacity-50 text-sm"
          >
            {downloading ? 'Saving…' : '⬇ Save Video to Phone'}
          </button>
        </div>

        {iosHint && (
          <div className="w-full rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-3 text-center">
            <p className="text-xs text-[#f5e6a3]/90 leading-relaxed">
              The video opened in your browser.<br />
              Tap <strong className="text-[#d4af37]">Share → Save to Files</strong> (or long-press the video and tap <strong className="text-[#d4af37]">Save to Photos</strong>) to keep it on your phone.
            </p>
            <button
              onClick={() => setIosHint(false)}
              className="mt-2 text-[10px] uppercase tracking-widest text-[#d4af37]/60 hover:text-[#d4af37]"
            >
              Got it ✕
            </button>
          </div>
        )}

        <p className="text-[10px] text-center text-[#fff8e7]/30 tracking-wide">
          MP4 · H.264 · AAC audio · 3 min · 12 MB · QuickTime &amp; phone compatible
        </p>
      </div>
    </main>
  );
}
