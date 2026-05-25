import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { OpeningScene } from './video_scenes/OpeningScene';
import { KaylinScene } from './video_scenes/KaylinScene';
import { KudakwasheScene } from './video_scenes/KudakwasheScene';
import { RumbidzaiScene } from './video_scenes/RumbidzaiScene';
import { TendaiScene } from './video_scenes/TendaiScene';
import { ZvikomboreroScene } from './video_scenes/ZvikomboreroScene';
import { FinaleScene } from './video_scenes/FinaleScene';

const SCENE_DURATIONS = {
  opening: 11000,
  kaylin: 29000,
  kudakwashe: 29000,
  rumbidzai: 26000,
  tendai: 26000,
  zvikomborero: 29000,
  finale: 30000,
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0f2e] text-[#fff8e7]">
      <div className="bg-noise" />

      {/* Persistent Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #d4af37, transparent)' }}
          animate={{ 
            x: ['-20%', '80%', '10%'], 
            y: ['10%', '60%', '-20%'], 
            scale: [1, 1.2, 0.8] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} 
        />
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #f5e6a3, transparent)' }}
          animate={{ 
            x: ['80%', '-20%', '50%'], 
            y: ['80%', '10%', '90%'], 
            scale: [0.8, 1.3, 1] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} 
        />
        
        {/* Persistent Floating Golden Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-[2px] h-[2px] rounded-full bg-[#f5e6a3] opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200 - Math.random() * 100],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, Math.random() * 0.4 + 0.1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="sync">
          {currentScene === 0 && <OpeningScene key="opening" />}
          {currentScene === 1 && <KaylinScene key="kaylin" />}
          {currentScene === 2 && <KudakwasheScene key="kudakwashe" />}
          {currentScene === 3 && <RumbidzaiScene key="rumbidzai" />}
          {currentScene === 4 && <TendaiScene key="tendai" />}
          {currentScene === 5 && <ZvikomboreroScene key="zvikomborero" />}
          {currentScene === 6 && <FinaleScene key="finale" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
