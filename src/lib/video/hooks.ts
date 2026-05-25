import { useState, useEffect, useRef } from 'react';

interface UseVideoPlayerOptions {
  durations: Record<string, number>;
  started: boolean;
}

export function useVideoPlayer({ durations, started }: UseVideoPlayerOptions) {
  const sceneKeys = Object.keys(durations);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const hasStoppedRef = useRef(false);

  useEffect(() => {
    if (!started) return;

    if (typeof window !== 'undefined') {
      window.startRecording?.();
    }

    const duration = durations[sceneKeys[currentSceneIndex]];
    const timer = setTimeout(() => {
      const nextIndex = currentSceneIndex + 1;
      if (nextIndex >= sceneKeys.length) {
        if (!hasStoppedRef.current) {
          hasStoppedRef.current = true;
          if (typeof window !== 'undefined') {
            window.stopRecording?.();
          }
        }
        setCurrentSceneIndex(0);
      } else {
        setCurrentSceneIndex(nextIndex);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [currentSceneIndex, started]);

  return { currentScene: currentSceneIndex };
}

declare global {
  interface Window {
    startRecording?: () => void;
    stopRecording?: () => void;
  }
}
