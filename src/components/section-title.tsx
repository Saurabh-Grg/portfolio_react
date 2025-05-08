
import { ReactNode, useState, useEffect, useRef } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string | ReactNode;
  center?: boolean;
  animateOnScroll?: boolean;
}

const SectionTitle = ({ 
  title, 
  subtitle, 
  center = false,
  animateOnScroll = true
}: SectionTitleProps) => {
  const [isVisible, setIsVisible] = useState(!animateOnScroll);
  const titleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!animateOnScroll) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2
      }
    );
    
    if (titleRef.current) {
      observer.observe(titleRef.current);
    }
    
    return () => observer.disconnect();
  }, [animateOnScroll]);
  
  return (
    <div 
      ref={titleRef}
      className={`mb-12 lg:mb-16 ${center ? 'text-center' : ''}`}
    >
      <h2 
        className={`text-3xl lg:text-4xl font-bold mb-4 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`}
      >
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && (
        <p 
          className={`text-muted-foreground text-lg max-w-3xl transition-all duration-700 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
