import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function FamilyScene() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),    // photo 1 fades in
      setTimeout(() => setPhase(2), 1600),   // title appears
      setTimeout(() => setPhase(3), 5000),   // crossfade to photo 2 (faster)
      setTimeout(() => setPhase(4), 10000),  // crossfade to photo 3 (faster)
      setTimeout(() => setPhase(5), 17500),  // begin exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 bg-[#FFFBF0] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 1.4 } }}
      transition={{ duration: 1.2 }}
    >
      <div className="absolute top-0 left-0 right-0 h-[6vh] bg-black z-30" />
      <div className="absolute bottom-0 left-0 right-0 h-[6vh] bg-black z-30" />

      {/* Family photo 1 — new outdoor crowd shot */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={phase >= 1 ? { opacity: phase >= 3 ? 0 : 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        transition={{ duration: phase >= 3 ? 2 : 1.8, ease: 'easeOut' }}
      >
        <img
          src={`${import.meta.env.BASE_URL}photos/family_crowd_new.jpeg`}
          alt="Family"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-white/15" />
      </motion.div>

      {/* Family photo 2 */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={phase >= 3 ? { opacity: phase >= 4 ? 0 : 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <img
          src={`${import.meta.env.BASE_URL}photos/family_2.jpeg`}
          alt="Family"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/15" />
      </motion.div>

      {/* Family photo 3 */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <img
          src={`${import.meta.env.BASE_URL}photos/family_3.jpeg`}
          alt="Family"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-white/10" />
      </motion.div>

      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(255,251,240,0.4) 100%)' }}
      />

      <div className="absolute bottom-[6vh] left-0 right-0 z-20 flex flex-col items-center pb-6"
        style={{ background: 'linear-gradient(to top, rgba(255,251,240,0.97) 0%, rgba(255,251,240,0.75) 60%, transparent 100%)', paddingTop: '8vh' }}
      >
        <motion.div
          className="h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-4"
          initial={{ width: 0 }}
          animate={phase >= 2 ? { width: '60vw' } : { width: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.h2
          className="font-display text-[#1a1200] font-bold tracking-[0.12em] text-center px-4"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 3.5rem)' }}
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={phase >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(6px)' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          United as One Family
        </motion.h2>
        <motion.div
          className="h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-4"
          initial={{ width: 0 }}
          animate={phase >= 2 ? { width: '40vw' } : { width: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
        />
      </div>
    </motion.div>
  );
}
