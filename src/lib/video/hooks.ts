import { useState, useEffect, useRef } from 'react';

interface UseVideoPlayerOptions {
  durations: Record<string, number>;
}

export function useVideoPlayer({ durations }: UseVideoPlayerOptions) {
  const sceneKeys = Object.keys(durations);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const hasStoppedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.startRecording?.();
    }
  }, []);

  useEffect(() => {
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
  }, [currentSceneIndex]);

  return { currentScene: currentSceneIndex };
}

declare global {
  interface Window {
    startRecording?: () => void;
    stopRecording?: () => void;
  }
}
