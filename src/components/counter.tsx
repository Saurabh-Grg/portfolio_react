
import { useState, useEffect, useRef } from 'react';

interface CounterProps {
  targetValue: number;
  duration?: number;
  label: string;
  suffix?: string;
  startWhenVisible?: boolean;
}

const Counter = ({
  targetValue,
  duration = 2000,
  label,
  suffix = '',
  startWhenVisible = true
}: CounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(!startWhenVisible);
  const counterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (startWhenVisible) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          root: null,
          threshold: 0.1
        }
      );
      
      if (counterRef.current) {
        observer.observe(counterRef.current);
      }
      
      return () => observer.disconnect();
    }
  }, [startWhenVisible]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number | null = null;
    let animationFrameId: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * targetValue));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, duration, isVisible]);
  
  return (
    <div ref={counterRef} className="flex flex-col items-center">
      <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
};

export default Counter;
