import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { OpeningScene } from './video_scenes/OpeningScene';
import { KaylinScene } from './video_scenes/KaylinScene';
import { KudakwasheScene } from './video_scenes/KudakwasheScene';
import { RumbidzaiScene } from './video_scenes/RumbidzaiScene';
import { TendaiScene } from './video_scenes/TendaiScene';
import { ZvikomboreroScene } from './video_scenes/ZvikomboreroScene';
import { FinaleScene } from './video_scenes/FinaleScene';

const SCENE_DURATIONS = {
  opening: 11000,
  kaylin: 29000,
  kudakwashe: 29000,
  rumbidzai: 26000,
  tendai: 26000,
  zvikomborero: 29000,
  finale: 30000,
};

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

export default function VideoTemplate() {
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS, started });

  const handlePlay = useCallback(() => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.75;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0f2e] text-[#fff8e7]">
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/graduation_music.mp3`}
        preload="auto"
      />

      <div className="bg-noise" />

      {/* Persistent Background */}
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

      {/* Video scenes */}
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="sync">
          {currentScene === 0 && <OpeningScene key="opening" />}
          {currentScene === 1 && <KaylinScene key="kaylin" />}
          {currentScene === 2 && <KudakwasheScene key="kudakwashe" />}
          {currentScene === 3 && <RumbidzaiScene key="rumbidzai" />}
          {currentScene === 4 && <TendaiScene key="tendai" />}
          {currentScene === 5 && <ZvikomboreroScene key="zvikomborero" />}
          {currentScene === 6 && <FinaleScene key="finale" />}
        </AnimatePresence>
      </div>

      {/* Play overlay — shown until user clicks */}
      <AnimatePresence>
        {!started && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(10,15,46,0.88)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' } }}
          >
            {/* Title */}
            <motion.p
              className="font-body text-[1.2vw] tracking-[0.3em] uppercase text-[#d4af37] mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Ziklag Class of 2026
            </motion.p>
            <motion.h1
              className="font-display text-[4vw] text-[#f5e6a3] font-bold tracking-wide text-center mb-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              A Ceremony of Excellence
            </motion.h1>

            {/* Golden divider */}
            <motion.div
              className="h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-10"
              initial={{ width: 0 }}
              animate={{ width: '30vw' }}
              transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            />

            {/* Play button */}
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
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '1px solid #d4af37' }}
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
              {/* Play triangle */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#d4af37">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </motion.button>

            <motion.p
              className="mt-6 font-body text-[0.85vw] text-[#fff8e7]/40 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Click to begin with music
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
