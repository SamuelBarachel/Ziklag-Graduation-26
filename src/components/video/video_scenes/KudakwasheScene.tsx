import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Confetti } from '../Confetti';

export function KudakwasheScene() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3800),
      setTimeout(() => setPhase(4), 10000),
      setTimeout(() => setPhase(5), 20000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 bg-[#FFFBF0] flex flex-col overflow-hidden"
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: '0%' }}
      exit={{ opacity: 0, x: '-100%', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute top-0 left-0 right-0 h-[8vh] bg-black z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-black z-20" />

      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.18) 50%, transparent 60%)' }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
      />

      <Confetti active={phase >= 2} />

      <div className="h-[8vh] flex-shrink-0" />
      <div className="flex-1 flex flex-row items-center justify-center gap-[2vw] px-6 overflow-hidden">

        <motion.div
          className="hidden sm:flex aspect-[3/4] rounded-sm overflow-hidden border border-[#d4af37]/60 shadow-xl flex-shrink-0 bg-white"
          style={{ height: '88%', maxHeight: '88%' }}
          initial={{ opacity: 0, x: -80, rotateY: 40 }}
          animate={phase >= 4 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -80, rotateY: 40 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={`${import.meta.env.BASE_URL}photos/kudakwashe_2.jpeg`} alt="Kudakwashe" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          className="relative flex-shrink-0 aspect-[3/4]"
          style={{ height: phase >= 4 ? '94%' : '100%', maxHeight: '100%', transition: 'height 1.2s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <motion.div
            className="w-full h-full relative bg-white rounded-sm overflow-hidden"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={phase >= 1 ? { clipPath: 'circle(150% at 50% 50%)' } : { clipPath: 'circle(0% at 50% 50%)' }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={`${import.meta.env.BASE_URL}photos/kudakwashe_solo.jpeg`} alt="Kudakwashe Solo" className="w-full h-full object-cover object-top" />
            <motion.svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 133" preserveAspectRatio="none">
              <motion.rect x="2" y="2" width="96" height="129" fill="none" stroke="#d4af37" strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={phase >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.4 }}
              />
            </motion.svg>
          </motion.div>
        </motion.div>

        <motion.div
          className="hidden sm:flex aspect-[3/4] rounded-sm overflow-hidden border border-[#d4af37]/60 shadow-xl flex-shrink-0 bg-white"
          style={{ height: '88%', maxHeight: '88%' }}
          initial={{ opacity: 0, x: 80, rotateY: -40 }}
          animate={phase >= 4 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 80, rotateY: -40 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <img src={`${import.meta.env.BASE_URL}photos/kudakwashe_3.jpeg`} alt="Kudakwashe" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      <div className="h-[28vh] bg-gradient-to-t from-[#FFF3C4] to-[#FFFBF0] flex flex-col items-center justify-center px-8 flex-shrink-0" style={{ zIndex: 15, position: 'relative' }}>
        <motion.div
          className="h-[1px] mx-auto mb-3 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
          initial={{ width: 0 }}
          animate={phase >= 2 ? { width: '55%' } : { width: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
        <h2 className="font-display text-[#1a1200] font-semibold tracking-wide leading-tight text-center" style={{ fontSize: 'clamp(1.25rem, 2.4vw, 2.6rem)' }}>
          {'Brethren Kudakwashe Ngoma'.split(' ').map((word, i) => (
            <span key={i} className="mr-[0.5vw]">
              {word.split('').map((char, j) => (
                <motion.span key={j} className="inline-block"
                  initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                  animate={phase >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 14, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6, delay: phase >= 2 ? i * 0.16 + j * 0.022 : 0 }}
                >{char}</motion.span>
              ))}
            </span>
          ))}
        </h2>
        <motion.p
          className="mt-2 font-body text-sm sm:text-[1.25vw] text-[#7a5c1e] tracking-[0.18em] uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          PhD in Biomedical Sciences
        </motion.p>
        <motion.p
          className="mt-1 font-body text-xs sm:text-[0.85vw] text-[#b8860b] tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Class of 2026
        </motion.p>
        <motion.div
          className="h-[1px] mx-auto mt-3 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
          initial={{ width: 0 }}
          animate={phase >= 3 ? { width: '35%' } : { width: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        />
      </div>
      <div className="h-[8vh] flex-shrink-0" />
    </motion.div>
  );
}
