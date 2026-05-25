import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const graduates = [
  { name: "Kaylin Mangwinyana", photo: "kaylin_solo.jpeg" },
  { name: "Kudakwashe Ngoma", photo: "kudakwashe_solo.jpeg" },
  { name: "Rumbidzai Mushonga", photo: "rumbidzai_solo.jpeg" },
  { name: "Tendai Bokisaara", photo: "tendai_solo.jpeg" },
  { name: "Zvikomborero Mziti", photo: "zvikomborero_solo.jpeg" },
];

export function FinaleScene() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => setPhase(5), 25000), // burst before fade out
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-[#0a0f2e] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2 } }}
      transition={{ duration: 1.5 }}
    >
      {/* Light Burst at the end */}
      <motion.div 
        className="absolute inset-0 z-50 pointer-events-none bg-white"
        initial={{ opacity: 0 }}
        animate={phase >= 5 ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      <div className="relative z-10 text-center mb-10">
        <motion.h1 
          className="text-5xl md:text-7xl font-display font-bold text-[#f5e6a3] tracking-[0.1em] uppercase shadow-black drop-shadow-lg"
          initial={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: -30, filter: 'blur(10px)' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          United in Excellence
        </motion.h1>
        
        <motion.div 
          className="mt-4 text-2xl md:text-3xl font-body text-[#fff8e7] tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          Congratulations, Class of 2026
        </motion.div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-6 px-4">
        {graduates.map((grad, idx) => (
          <motion.div 
            key={grad.name}
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 1.2, delay: phase >= 1 ? idx * 0.2 : 0, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-40 md:w-48 aspect-[3/4] relative rounded-sm overflow-hidden border border-[#d4af37]/50 shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-[#0a0f2e]">
              <img src={`${import.meta.env.BASE_URL}photos/${grad.photo}`} alt={grad.name} className="w-full h-full object-contain" />
            </div>
            <div className="mt-3 text-center">
              <h3 className="font-display text-xl text-[#f5e6a3]">{grad.name}</h3>
            </div>
            
            {/* Connecting Glow behind photos */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#d4af37] rounded-full filter blur-[50px] opacity-20 -z-10"
              animate={phase >= 3 ? { scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Intense particle burst during finale */}
      {phase >= 4 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`burst-${i}`}
              className="absolute w-2 h-2 rounded-full bg-white opacity-80"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                x: (Math.random() - 0.5) * window.innerWidth,
                y: (Math.random() - 0.5) * window.innerHeight,
                scale: Math.random() * 2,
                opacity: 0
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
