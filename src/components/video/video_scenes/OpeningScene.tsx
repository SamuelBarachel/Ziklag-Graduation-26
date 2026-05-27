import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function OpeningScene() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f2e] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
      transition={{ duration: 1.5 }}
    >
      {/* Cinematic bars */}
      <div className="absolute top-0 left-0 right-0 h-[8vh] bg-black z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-black z-20" />

      {/* Golden radial glow */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(212,175,55,0.18) 0%, transparent 65%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Horizontal light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.06) 50%, transparent 100%)' }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 4, delay: 1.5, ease: 'easeInOut' }}
      />

      <div className="relative z-10 text-center flex flex-col items-center gap-6 px-8">
        <motion.p
          className="text-[1.1vw] tracking-[0.5em] uppercase text-[#d4af37]/80 font-body"
          initial={{ opacity: 0, y: -10 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 1.2 }}
        >
          Class of 2026
        </motion.p>

        <motion.h1
          className="text-[6vw] md:text-[7vw] font-display font-bold text-[#d4af37] tracking-wider leading-none"
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={phase >= 1 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 30, filter: 'blur(8px)' }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          A Celebration
          <br />
          <span className="text-[#f5e6a3]">of Excellence</span>
        </motion.h1>

        <motion.div
          className="h-[1px] bg-gradient-to-r from-transparent via-[#f5e6a3] to-transparent"
          animate={phase >= 2 ? { width: '70%' } : { width: '0%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ width: '0%' }}
        />

        <motion.p
          className="text-[1.8vw] font-display text-[#fff8e7]/80 tracking-[0.3em] uppercase"
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={phase >= 3 ? { opacity: 1, letterSpacing: '0.3em' } : { opacity: 0, letterSpacing: '0.1em' }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          A Ceremony of Excellence
        </motion.p>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 24 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-[#f5e6a3]"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 17) % 100}%`,
            }}
            animate={{
              y: [0, -(120 + (i * 29) % 80)],
              x: [0, ((i * 41 + 7) % 60) - 30],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 5 + (i * 7) % 5,
              repeat: Infinity,
              delay: (i * 3) % 6,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
