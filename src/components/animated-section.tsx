
import { ReactNode, useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  animation?: 'fade-in' | 'slide-right' | 'scale-in' | 'slide-up';
  delay?: number;
}

const AnimatedSection = ({ 
  children, 
  id, 
  className = '', 
  animation = 'fade-in',
  delay = 0
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.1
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, [delay]);
  
  const animationClasses = {
    'fade-in': 'opacity-0 translate-y-10',
    'slide-right': 'opacity-0 -translate-x-20',
    'scale-in': 'opacity-0 scale-95',
    'slide-up': 'opacity-0 translate-y-20'
  };
  
  return (
    <section
      id={id}
      ref={sectionRef}
      className={`${className} transition-all duration-700 ease-out ${
        isVisible ? '' : animationClasses[animation]
      }`}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;
