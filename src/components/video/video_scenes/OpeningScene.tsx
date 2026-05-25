import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function OpeningScene() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 8500), // begin exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f2e] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.5 }}
    >
      {/* Golden light rays */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.2) 0%, transparent 60%)'
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.h1 
          className="text-6xl md:text-8xl font-display font-bold text-[#d4af37] tracking-wider mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          A Celebration of Excellence
        </motion.h1>

        <motion.div 
          className="h-[1px] bg-gradient-to-r from-transparent via-[#f5e6a3] to-transparent w-0"
          animate={phase >= 2 ? { width: '80%' } : { width: '0%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        <motion.h2 
          className="text-3xl md:text-5xl font-display text-[#fff8e7] tracking-[0.2em] mt-6 uppercase"
          initial={{ opacity: 0, scale: 0.95, letterSpacing: '0.1em' }}
          animate={phase >= 3 ? { opacity: 1, scale: 1, letterSpacing: '0.2em' } : { opacity: 0, scale: 0.95, letterSpacing: '0.1em' }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          Ziklag Class of 2026
        </motion.h2>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#f5e6a3] opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100 - Math.random() * 100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, Math.random() * 0.5 + 0.3, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
