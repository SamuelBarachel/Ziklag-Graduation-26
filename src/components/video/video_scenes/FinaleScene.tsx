import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const graduates = [
  { prefix: "Brethren", name: "Kaylin Mangwinyana",          degree: "Master of Project Management",          photo: "kaylin_solo.jpeg" },
  { prefix: "Brethren", name: "Kudakwashe Ngoma",            degree: "PhD in Biomedical Sciences",             photo: "kudakwashe_solo.jpeg" },
  { prefix: "Brethren", name: "Rumbidzai Charlene Mushonga", degree: "BSN, RN, PHN — Nursing, With Honors",    photo: "rumbidzai_solo.jpeg" },
  { prefix: "Brethren", name: "Tendai Bokisaara",            degree: "Global Management — Global Business",    photo: "tendai_solo.jpeg" },
  { prefix: "Brother",  name: "Zvikomborero Mziti",          degree: "Master of Project Management",          photo: "zvikomborero_solo.jpeg" },
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
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3200),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => setPhase(5), 16000), // white flash — earlier to make room for slideshow
      // Family photo slideshow — each photo ~6s, appears once (also shown in FamilyScene)
      // family_3 is on screen from 29.5s → 36s (173.5s–180s of ceremony) ✓
      setTimeout(() => setPhase(6), 17500), // photo 1
      setTimeout(() => setPhase(7), 23500), // photo 2
      setTimeout(() => setPhase(8), 29500), // photo 3 — last slide, on screen when video ends
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

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
      {/* Cinematic bars */}
      <div className="absolute top-0 left-0 right-0 h-[8vh] bg-black z-30" />
      <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-black z-30" />

      {/* Radial glow */}
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
      <div className="relative z-10 text-center mb-[1.5vh] mt-[1vh]">
        <motion.div
          className="h-[1px] mx-auto mb-3 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
          initial={{ width: 0 }}
          animate={phase >= 2 ? { width: '50vw' } : { width: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.h1
          className="font-display text-[#f5e6a3] font-bold tracking-[0.12em] uppercase"
          style={{ fontSize: 'clamp(1.4rem, 2.8vw, 3.2rem)' }}
          initial={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          animate={phase >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          United in Excellence
        </motion.h1>
        <motion.div
          className="h-[1px] mx-auto mt-3 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
          initial={{ width: 0 }}
          animate={phase >= 3 ? { width: '35vw' } : { width: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>

      {/* Photo grid */}
      <div className="relative z-10 flex flex-col items-center gap-[1.2vh]">
        <div className="flex flex-row items-end justify-center gap-3 sm:gap-[1.8vw]">
          {topRow.map((grad, idx) => (
            <GraduateCard key={grad.name} grad={grad} idx={idx} phase={phase} />
          ))}
        </div>
        <div className="flex flex-row items-end justify-center gap-3 sm:gap-[1.8vw]">
          {bottomRow.map((grad, idx) => (
            <GraduateCard key={grad.name} grad={grad} idx={idx + 3} phase={phase} />
          ))}
        </div>
      </div>

      {/* Particle burst */}
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

      {/* ── Family photo slideshow ── after flash, each ~6s, family_3 is the last slide */}
      <AnimatePresence>
        {phase >= 6 && (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ zIndex: 45 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {/* Cinematic bars sit above photos */}
            <div className="absolute top-0 left-0 right-0 h-[8vh] bg-black z-20" />
            <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-black z-20" />

            {/* Photo 1 */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={phase >= 6 && phase < 7 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            >
              <img src={`${import.meta.env.BASE_URL}photos/family_1.jpeg`} alt="Family" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-[#0a0f2e]/40" />
            </motion.div>

            {/* Photo 2 */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={phase >= 7 && phase < 8 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            >
              <img src={`${import.meta.env.BASE_URL}photos/family_2.jpeg`} alt="Family" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-[#0a0f2e]/40" />
            </motion.div>

            {/* Photo 3 — family_3, visible from 29.5s into Finale → end of video (180s) */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={phase >= 8 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            >
              <img src={`${import.meta.env.BASE_URL}photos/family_3.jpeg`} alt="Family" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-[#0a0f2e]/35" />
            </motion.div>

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(5,8,16,0.6) 100%)' }}
            />

            {/* Caption strip at bottom */}
            <div
              className="absolute bottom-[8vh] left-0 right-0 z-10 flex flex-col items-center pb-4"
              style={{ background: 'linear-gradient(to top, rgba(2,6,18,0.92) 0%, rgba(2,6,18,0.55) 60%, transparent 100%)', paddingTop: '6vh' }}
            >
              <motion.div
                className="h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '50vw' }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              />
              <motion.p
                className="mt-3 font-body text-[#d4af37]/70 tracking-[0.45em] uppercase"
                style={{ fontSize: 'clamp(0.6rem, 0.9vw, 0.85rem)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 1 }}
              >
                Class of 2026
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GraduateCard({ grad, idx, phase }: { grad: (typeof graduates)[number]; idx: number; phase: number }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.85 }}
      transition={{ duration: 1.1, delay: phase >= 1 ? idx * 0.18 : 0, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative rounded-sm overflow-hidden bg-[#0a0f2e]"
        style={{ width: 'clamp(68px, 10vw, 200px)', aspectRatio: '3/4', border: '1px solid rgba(212,175,55,0.5)', boxShadow: '0 0 24px rgba(212,175,55,0.25)' }}
      >
        <img src={`${import.meta.env.BASE_URL}photos/${grad.photo}`} alt={grad.name} className="w-full h-full object-cover object-top" />
        <motion.svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 133" preserveAspectRatio="none">
          <motion.rect x="2" y="2" width="96" height="129" fill="none" stroke="#d4af37" strokeWidth="0.6"
            initial={{ pathLength: 0 }}
            animate={phase >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: idx * 0.18 + 0.3 }}
          />
        </motion.svg>
      </div>
      <motion.div
        className="mt-[0.6vh] text-center"
        style={{ maxWidth: 'clamp(80px, 13vw, 260px)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.8, delay: idx * 0.18 + 0.5 }}
      >
        <p style={{ fontSize: 'clamp(9px, 0.65vw, 11px)' }} className="font-body text-[#d4af37]/80 tracking-widest uppercase mb-[0.1vh]">{grad.prefix}</p>
        <h3 style={{ fontSize: 'clamp(10px, 0.9vw, 15px)' }} className="font-display text-[#f5e6a3] font-semibold leading-tight">{grad.name}</h3>
        <p style={{ fontSize: 'clamp(8px, 0.65vw, 11px)' }} className="mt-[0.2vh] font-body text-[#fff8e7]/60 tracking-wider leading-snug">{grad.degree}</p>
      </motion.div>
    </motion.div>
  );
}
