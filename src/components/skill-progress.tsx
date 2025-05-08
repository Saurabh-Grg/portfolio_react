
import { useState, useEffect, useRef } from 'react';

interface SkillProgressProps {
  name: string;
  percentage: number;
  color?: string;
  delay?: number;
  icon?: React.ReactNode;
}

const SkillProgress = ({
  name,
  percentage,
  color = 'from-flutter to-tech-accent',
  delay = 0,
  icon
}: SkillProgressProps) => {
  const [width, setWidth] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setWidth(percentage);
          }, delay);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.1
      }
    );
    
    if (progressRef.current) {
      observer.observe(progressRef.current);
    }
    
    return () => observer.disconnect();
  }, [percentage, delay]);
  
  return (
    <div ref={progressRef} className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="font-medium">{name}</span>
        </div>
        <span className="text-sm">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export default SkillProgress;
