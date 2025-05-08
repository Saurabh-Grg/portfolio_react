
import { useState, useEffect, useRef } from 'react';

interface TimelineItemProps {
  date: string;
  title: string;
  company: string;
  description: string;
  logo?: string;
  index: number;
}

const TimelineItem = ({ date, title, company, description, logo, index }: TimelineItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 200);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.1
      }
    );
    
    if (itemRef.current) {
      observer.observe(itemRef.current);
    }
    
    return () => observer.disconnect();
  }, [index]);
  
  return (
    <div 
      ref={itemRef}
      className={`mb-12 md:flex transition-all duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="md:w-1/4 mb-4 md:mb-0">
        <div className="flex items-center">
          {logo && (
            <div className="w-10 h-10 mr-3 flex-shrink-0">
              <img src={logo} alt={company} className="w-full h-full object-contain" />
            </div>
          )}
          <span className="text-sm font-medium text-muted-foreground">{date}</span>
        </div>
      </div>
      
      <div className="md:w-3/4 md:pl-8 relative before:hidden md:before:block before:absolute before:-left-1 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-flutter">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <h4 className="text-flutter mb-3">{company}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

interface TimelineProps {
  items: Array<Omit<TimelineItemProps, 'index'>>;
}

const Timeline = ({ items }: TimelineProps) => {
  return (
    <div className="relative before:hidden md:before:block before:absolute before:left-1/4 before:top-0 before:bottom-0 before:w-px before:-ml-px before:bg-border">
      {items.map((item, index) => (
        <TimelineItem key={index} {...item} index={index} />
      ))}
    </div>
  );
};

export default Timeline;
