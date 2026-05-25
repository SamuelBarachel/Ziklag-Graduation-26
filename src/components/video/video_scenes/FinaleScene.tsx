import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

const graduates = [
  {
    prefix: "Brethren",
    name: "Kaylin Mangwinyana",
    degree: "Masters in Project Management",
    photo: "kaylin_solo.jpeg",
  },
  {
    prefix: "Brethren",
    name: "Kudakwashe Ngoma",
    degree: "PhD in Biomedical Sciences",
    photo: "kudakwashe_solo.jpeg",
  },
  {
    prefix: "Brethren",
    name: "Rumbidzai Charlene Mushonga",
    degree: "BSN, RN, PHN — Nursing, With Honors",
    photo: "rumbidzai_solo.jpeg",
  },
  {
    prefix: "Brethren",
    name: "Tendai Bokisaara",
    degree: "Global Management (Global Business)",
    photo: "tendai_solo.jpeg",
  },
  {
    prefix: "Brother",
    name: "Zvikomborero Mziti",
    degree: "Masters in Project Management",
    photo: "zvikomborero_solo.jpeg",
  },
];

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 11) % 100}%`,
  dx: ((i * 31 + 5) % 200) - 100,
  dy: ((i * 37 + 13) % 200) - 100,
  size: ((i * 7 + 3) % 6) + 2,
  duration: 2 + ((i * 11 + 7) % 3),
}));

export function FinaleScene() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // photos stagger in
      setTimeout(() => setPhase(2), 1800),  // "United in Excellence" appears
      setTimeout(() => setPhase(3), 3200),  // "Congratulations" appears
      setTimeout(() => setPhase(4), 5000),  // golden glow pulses
      setTimeout(() => setPhase(5), 24000), // burst
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // Top row: 3 graduates, bottom row: 2 — centered
  const topRow = graduates.slice(0, 3);
  const bottomRow = graduates.slice(3, 5);

  return (
    <motion.div
      className="absolute inset-0 bg-[#0a0f2e] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2 } }}
      transition={{ duration: 1.5 }}
    >
      {/* Radial glow behind the collage */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* White flash burst */}
      <motion.div
        className="absolute inset-0 z-50 pointer-events-none bg-white"
        initial={{ opacity: 0 }}
        animate={phase >= 5 ? { opacity: [0, 0.9, 0] } : { opacity: 0 }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* Header */}
      <div className="relative z-10 text-center mb-[2vh]">
        <motion.div
          className="h-[1px] mx-auto mb-4 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
          initial={{ width: 0 }}
          animate={phase >= 2 ? { width: '50vw' } : { width: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.h1
          className="font-display text-[4.5vw] text-[#f5e6a3] font-bold tracking-[0.12em] uppercase"
          initial={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          animate={phase >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          United in Excellence
        </motion.h1>
        <motion.p
          className="mt-2 font-body text-[1.5vw] text-[#fff8e7]/80 tracking-[0.22em] uppercase"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          Congratulations, Class of 2026
        </motion.p>
        <motion.div
          className="h-[1px] mx-auto mt-4 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
          initial={{ width: 0 }}
          animate={phase >= 3 ? { width: '35vw' } : { width: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>

      {/* Photo grid — top row: 3, bottom row: 2 */}
      <div className="relative z-10 flex flex-col items-center gap-[1.5vh]">

        {/* Top row — 3 graduates */}
        <div className="flex flex-row items-end justify-center gap-[2vw]">
          {topRow.map((grad, idx) => (
            <GraduateCard key={grad.name} grad={grad} idx={idx} phase={phase} />
          ))}
        </div>

        {/* Bottom row — 2 graduates, centered */}
        <div className="flex flex-row items-end justify-center gap-[2vw]">
          {bottomRow.map((grad, idx) => (
            <GraduateCard key={grad.name} grad={grad} idx={idx + 3} phase={phase} />
          ))}
        </div>
      </div>

      {/* Golden particle burst */}
      {phase >= 4 && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {PARTICLES.map(p => (
            <motion.div
              key={`burst-${p.id}`}
              className="absolute rounded-full bg-[#f5e6a3]"
              style={{ left: '50%', top: '50%', width: p.size, height: p.size }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{ x: p.dx * 8, y: p.dy * 8, scale: 1, opacity: 0 }}
              transition={{ duration: p.duration, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function GraduateCard({
  grad,
  idx,
  phase,
}: {
  grad: (typeof graduates)[number];
  idx: number;
  phase: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.85 }}
      transition={{ duration: 1.1, delay: phase >= 1 ? idx * 0.18 : 0, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Photo */}
      <div
        className="relative rounded-sm overflow-hidden bg-[#0a0f2e]"
        style={{ width: '12vw', aspectRatio: '3/4', border: '1px solid rgba(212,175,55,0.5)', boxShadow: '0 0 24px rgba(212,175,55,0.25)' }}
      >
        <img
          src={`${import.meta.env.BASE_URL}photos/${grad.photo}`}
          alt={grad.name}
          className="w-full h-full object-contain"
        />
        {/* Golden corner accents */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 133" preserveAspectRatio="none">
          <motion.rect
            x="2" y="2" width="96" height="129"
            fill="none" stroke="#d4af37" strokeWidth="0.6"
            initial={{ pathLength: 0 }}
            animate={phase >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: idx * 0.18 + 0.3 }}
          />
        </svg>
      </div>

      {/* Name + degree */}
      <motion.div
        className="mt-[0.8vh] text-center w-full"
        style={{ maxWidth: '16vw' }}
        initial={{ opacity: 0, y: 8 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.8, delay: idx * 0.18 + 0.5 }}
      >
        <p className="font-body text-[0.85vw] text-[#d4af37]/80 tracking-widest uppercase mb-[0.2vh]">
          {grad.prefix}
        </p>
        <h3 className="font-display text-[1.1vw] text-[#f5e6a3] font-semibold leading-tight">
          {grad.name}
        </h3>
        <p className="mt-[0.3vh] font-body text-[0.75vw] text-[#fff8e7]/60 tracking-wider leading-snug">
          {grad.degree}
        </p>
      </motion.div>
    </motion.div>
  );
}
