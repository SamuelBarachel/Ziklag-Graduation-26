import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function KaylinScene() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),   // circle reveals + frame draws
      setTimeout(() => setPhase(2), 2000),  // name shimmers in
      setTimeout(() => setPhase(3), 3800),  // degree fades in
      setTimeout(() => setPhase(4), 10000), // side photos roll in (name+degree visible for 6+ seconds first)
      setTimeout(() => setPhase(5), 26000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 bg-[#0a0f2e] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '-100%', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 0.8 }}
    >
      {/* Golden sweep shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.07) 50%, transparent 60%)' }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
      />

      {/* Photo row */}
      <div className="flex flex-row items-center justify-center gap-6 w-full px-8">

        {/* Left side photo */}
        <motion.div
          className="w-[18vw] aspect-[3/4] rounded-sm overflow-hidden border border-[#d4af37]/40 shadow-2xl flex-shrink-0"
          initial={{ opacity: 0, x: -80, rotateY: 40 }}
          animate={phase >= 4 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -80, rotateY: 40 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 600 }}
        >
          <img src={`${import.meta.env.BASE_URL}photos/kaylin_2.jpeg`} alt="Kaylin" className="w-full h-full object-cover" />
        </motion.div>

        {/* Center solo photo */}
        <motion.div
          className="relative flex-shrink-0"
          animate={phase >= 4 ? { width: '22vw' } : { width: '30vw' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ aspectRatio: '3/4' }}
        >
          <motion.div
            className="w-full h-full relative"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={phase >= 1 ? { clipPath: 'circle(150% at 50% 50%)' } : { clipPath: 'circle(0% at 50% 50%)' }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={`${import.meta.env.BASE_URL}photos/kaylin_solo.jpeg`} alt="Kaylin Solo" className="w-full h-full object-cover rounded-sm shadow-2xl" />

            {/* Golden frame */}
            <motion.svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 133" preserveAspectRatio="none">
              <motion.rect
                x="2" y="2" width="96" height="129"
                fill="none" stroke="#d4af37" strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={phase >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.4 }}
              />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Right side photo */}
        <motion.div
          className="w-[18vw] aspect-[3/4] rounded-sm overflow-hidden border border-[#d4af37]/40 shadow-2xl flex-shrink-0"
          initial={{ opacity: 0, x: 80, rotateY: -40 }}
          animate={phase >= 4 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 80, rotateY: -40 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{ perspective: 600 }}
        >
          <img src={`${import.meta.env.BASE_URL}photos/kaylin_3.jpeg`} alt="Kaylin" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Name + Degree — clearly below the photos */}
      <div className="mt-8 text-center px-8 max-w-4xl">
        {/* Golden divider */}
        <motion.div
          className="h-[1px] mx-auto mb-5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
          initial={{ width: 0 }}
          animate={phase >= 2 ? { width: '60%' } : { width: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />

        <h2 className="font-display text-[3.5vw] text-[#f5e6a3] font-semibold tracking-wide leading-tight">
          {'Brethren Kaylin Mangwinyana'.split(' ').map((word, i) => (
            <span key={i} className="inline-block mr-3">
              {word.split('').map((char, j) => (
                <motion.span
                  key={j}
                  className="inline-block"
                  initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                  animate={phase >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 18, filter: 'blur(4px)' }}
                  transition={{ duration: 0.7, delay: phase >= 2 ? (i * 0.18) + (j * 0.025) : 0 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </h2>

        <motion.p
          className="mt-3 font-body text-[1.4vw] text-[#fff8e7]/75 tracking-[0.18em] uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          Master of Project Management
        </motion.p>

        {/* Bottom golden divider */}
        <motion.div
          className="h-[1px] mx-auto mt-5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
          initial={{ width: 0 }}
          animate={phase >= 3 ? { width: '40%' } : { width: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        />
      </div>
    </motion.div>
  );
}
