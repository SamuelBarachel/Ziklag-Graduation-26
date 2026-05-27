import { motion } from 'framer-motion';

const CONFETTI_COLORS = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF6BB5','#FFB347','#A78BFA','#d4af37','#FF8C42'];
const BALLOON_COLORS  = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF6BB5','#A78BFA'];

const pieces = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  x: (i * 23 + 7) % 100,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  w: 5 + (i * 3) % 8,
  h: 8 + (i * 5) % 10,
  rot: (i * 47) % 360,
  delay: i * 0.07,
  dur: 2.2 + (i * 0.09) % 1.2,
  xDrift: ((i * 11) % 80) - 40,
  circle: i % 4 === 0,
}));

const balloons = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  x: 5 + (i * 14) % 90,
  color: BALLOON_COLORS[i % BALLOON_COLORS.length],
  delay: i * 0.25,
  r: 13 + (i * 3) % 8,
}));

export function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 12 }}>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.circle ? p.w : p.w,
            height: p.circle ? p.w : p.h,
            background: p.color,
            borderRadius: p.circle ? '50%' : '2px',
            opacity: 0,
          }}
          animate={{
            y: ['0vh', '105vh'],
            rotate: [p.rot, p.rot + (p.id % 2 === 0 ? 540 : -540)],
            x: [0, p.xDrift],
            opacity: [0, 1, 1, 0.2, 0],
          }}
          transition={{ duration: p.dur + 1, delay: p.delay, ease: 'easeIn', repeat: 1, repeatDelay: 1.5 }}
        />
      ))}

      {balloons.map(b => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{ left: `${b.x}%`, bottom: -(b.r * 2 + 40) }}
          initial={{ opacity: 0 }}
          animate={{ y: -(1000 + b.r * 10), x: ((b.id * 13) % 60) - 30, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 5 + b.id * 0.6, delay: b.delay + 0.4, ease: 'easeOut' }}
        >
          <svg width={b.r * 2} height={b.r * 2 + 30} viewBox={`0 0 ${b.r * 2} ${b.r * 2 + 30}`}>
            <ellipse cx={b.r} cy={b.r} rx={b.r - 1} ry={b.r} fill={b.color} opacity={0.88} />
            <path d={`M${b.r} ${b.r * 2} Q${b.r - 3} ${b.r * 2 + 8} ${b.r} ${b.r * 2 + 16} Q${b.r + 3} ${b.r * 2 + 22} ${b.r} ${b.r * 2 + 28}`} stroke={b.color} strokeWidth="1.4" fill="none" opacity={0.7} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
