import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { OpeningScene } from './video_scenes/OpeningScene';
import { KaylinScene } from './video_scenes/KaylinScene';
import { KudakwasheScene } from './video_scenes/KudakwasheScene';
import { RumbidzaiScene } from './video_scenes/RumbidzaiScene';
import { TendaiScene } from './video_scenes/TendaiScene';
import { ZvikomboreroScene } from './video_scenes/ZvikomboreroScene';
import { FamilyScene } from './video_scenes/FamilyScene';
import { FinaleScene } from './video_scenes/FinaleScene';

const SCENE_DURATIONS = {
  opening: 9000,
  kaylin: 23000,
  kudakwashe: 23000,
  rumbidzai: 23000,
  tendai: 21000,
  zvikomborero: 23000,
  family: 22000,
  finale: 36000,
};

const TOTAL_SECONDS = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0) / 1000;

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${(i * 33 + 7) % 100}%`,
  top: `${(i * 47 + 13) % 100}%`,
  yEnd: -(200 + (i * 37 + 11) % 100),
  xDrift: ((i * 53 + 17) % 100) - 50,
  opacity: (i * 7 + 3) % 4 * 0.1 + 0.1,
  duration: 10 + (i * 11 + 5) % 15,
  delay: (i * 7 + 3) % 10,
}));

function getSupportedMimeType() {
  const types = [
    'video/mp4;codecs=h264,aac',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}

export default function VideoTemplate() {
  const [started, setStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS, started });

  const canRecord = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getDisplayMedia;

  useEffect(() => {
    window.startRecording = () => {
      const mr = mediaRecorderRef.current;
      if (mr && mr.state === 'inactive') {
        mr.start(1000);
        setRecording(true);
        setElapsed(0);
        elapsedIntervalRef.current = setInterval(() => {
          setElapsed(s => s + 1);
        }, 1000);
      }
    };

    window.stopRecording = () => {
      const mr = mediaRecorderRef.current;
      if (mr && mr.state !== 'inactive') {
        mr.stop();
      }
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
      }
    };

    return () => {
      window.startRecording = undefined;
      window.stopRecording = undefined;
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    };
  }, []);

  const handlePlay = useCallback(() => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.75;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const handleRecordAndExport = useCallback(async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: { frameRate: 30, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true,
        preferCurrentTab: true,
      } as any);

      const mimeType = getSupportedMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
        setRecording(false);
        setRecordingDone(true);
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `graduation-2026.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      };

      handlePlay();
    } catch {
      alert('Screen sharing was cancelled. Please try again and select this browser tab to record.');
    }
  }, [handlePlay]);

  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0f2e] text-[#fff8e7]">
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/graduation_music.mp3`}
        preload="auto"
      />

      <div className="bg-noise" />

      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #d4af37, transparent)' }}
          animate={{ x: ['-20%', '80%', '10%'], y: ['10%', '60%', '-20%'], scale: [1, 1.2, 0.8] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #f5e6a3, transparent)' }}
          animate={{ x: ['80%', '-20%', '50%'], y: ['80%', '10%', '90%'], scale: [0.8, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        {PARTICLES.map(p => (
          <motion.div
            key={`particle-${p.id}`}
            className="absolute w-[2px] h-[2px] rounded-full bg-[#f5e6a3]"
            style={{ left: p.left, top: p.top, opacity: 0 }}
            animate={{ y: [0, p.yEnd], x: [0, p.xDrift], opacity: [0, p.opacity, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="sync">
          {currentScene === 0 && <OpeningScene key="opening" />}
          {currentScene === 1 && <KaylinScene key="kaylin" />}
          {currentScene === 2 && <KudakwasheScene key="kudakwashe" />}
          {currentScene === 3 && <RumbidzaiScene key="rumbidzai" />}
          {currentScene === 4 && <TendaiScene key="tendai" />}
          {currentScene === 5 && <ZvikomboreroScene key="zvikomborero" />}
          {currentScene === 6 && <FamilyScene key="family" />}
          {currentScene === 7 && <FinaleScene key="finale" />}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {recording && (
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-black/70 border border-red-500/60 px-4 py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-white">
              Recording — {mins}:{secs} left
            </span>
          </motion.div>
        )}
        {recordingDone && (
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#0a0f2e]/90 border border-[#d4af37]/60 px-4 py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[#f5e6a3]">
              ✓ Video saved to your Downloads
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!started && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(10,15,46,0.88)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' } }}
          >
            <motion.p
              className="font-body text-base sm:text-[1.2vw] tracking-[0.3em] uppercase text-[#d4af37] mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Class of 2026
            </motion.p>
            <motion.h1
              className="font-display text-2xl sm:text-[4vw] text-[#f5e6a3] font-bold tracking-wide text-center mb-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              A Ceremony of Excellence
            </motion.h1>

            <motion.div
              className="h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-10"
              initial={{ width: 0 }}
              animate={{ width: '30vw' }}
              transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            />

            <motion.button
              onClick={handlePlay}
              className="relative flex items-center justify-center w-24 h-24 rounded-full cursor-pointer focus:outline-none"
              style={{ border: '2px solid #d4af37', background: 'rgba(212,175,55,0.08)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.1, background: 'rgba(212,175,55,0.18)' }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '1px solid #d4af37' }}
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#d4af37">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </motion.button>

            <motion.p
              className="mt-6 font-body text-xs sm:text-[0.85vw] text-[#fff8e7]/40 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Click to begin with music
            </motion.p>

            {canRecord && (
              <motion.div
                className="mt-8 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <div className="h-[1px] w-[20vw] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-2" />
                <button
                  onClick={handleRecordAndExport}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/70 bg-[#d4af37]/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#f5e6a3] transition hover:bg-[#d4af37]/20 focus:outline-none"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" fill="#d4af37" />
                  </svg>
                  Record &amp; Save as Video File
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
