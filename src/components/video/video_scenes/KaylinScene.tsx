import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function KaylinScene() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Frame draws, circle expands
      setTimeout(() => setPhase(2), 2000),  // Name appears
      setTimeout(() => setPhase(3), 3500),  // Degree fades in
      setTimeout(() => setPhase(4), 8000),  // Additional photos roll in
      setTimeout(() => setPhase(5), 26000), // Exit choreography
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-[#0a0f2e] flex items-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '-100%', transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
            left: '-100%'
          }}
          exit={{ left: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto px-8 w-full h-full relative flex flex-col justify-center">
        <div className="flex flex-row items-center justify-center gap-12 w-full">
          
          {/* Side Photo Left */}
          <motion.div 
            className="w-1/4 aspect-[3/4] relative rounded-sm overflow-hidden border border-[#d4af37]/30 shadow-2xl"
            initial={{ opacity: 0, x: -100, rotateY: 45 }}
            animate={phase >= 4 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -100, rotateY: 45 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={`${import.meta.env.BASE_URL}photos/kaylin_2.jpeg`} alt="Kaylin" className="w-full h-full object-cover" />
          </motion.div>

          {/* Center Solo Photo */}
          <div className="relative w-1/3 aspect-[3/4] flex flex-col items-center">
            <motion.div 
              className="w-full h-full relative"
              initial={{ clipPath: 'circle(0% at 50% 50%)' }}
              animate={phase >= 1 ? { clipPath: 'circle(150% at 50% 50%)' } : { clipPath: 'circle(0% at 50% 50%)' }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={`${import.meta.env.BASE_URL}photos/kaylin_solo.jpeg`} alt="Kaylin Solo" className="w-full h-full object-cover rounded-sm shadow-2xl" />
              
              {/* Golden Frame */}
              <motion.svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.rect 
                  x="2" y="2" width="96" height="96" 
                  fill="none" 
                  stroke="#d4af37" 
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={phase >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                />
              </motion.svg>
            </motion.div>

            {/* Typography */}
            <div className="mt-8 text-center absolute -bottom-32 w-[150%]">
              <h2 className="font-display text-4xl md:text-5xl text-[#f5e6a3] font-semibold tracking-wide">
                {'Brethren Kaylin Mangwinyana'.split(' ').map((word, i) => (
                  <span key={i} className="inline-block mr-3">
                    {word.split('').map((char, j) => (
                      <motion.span 
                        key={j} 
                        className="inline-block"
                        initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                        animate={phase >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(5px)' }}
                        transition={{ duration: 0.8, delay: phase >= 2 ? (i * 0.2) + (j * 0.03) : 0 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h2>
              
              <motion.p 
                className="mt-4 font-body text-lg md:text-xl text-[#fff8e7]/80 tracking-widest uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                Master of Project Management
              </motion.p>
            </div>
          </div>

          {/* Side Photo Right */}
          <motion.div 
            className="w-1/4 aspect-[3/4] relative rounded-sm overflow-hidden border border-[#d4af37]/30 shadow-2xl"
            initial={{ opacity: 0, x: 100, rotateY: -45 }}
            animate={phase >= 4 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 100, rotateY: -45 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <img src={`${import.meta.env.BASE_URL}photos/kaylin_3.jpeg`} alt="Kaylin" className="w-full h-full object-cover" />
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
