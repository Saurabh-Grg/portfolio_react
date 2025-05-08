
import { useState, useEffect } from 'react';

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  animationStyle?: 'fade' | 'slide' | 'flip' | 'typewriter';
}

const RotatingText = ({ texts, interval = 2000, animationStyle = 'fade' }: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [displayText, setDisplayText] = useState(texts[0]);
  const [typingIndex, setTypingIndex] = useState(0);
  
  useEffect(() => {
    // For typewriter effect
    if (animationStyle === 'typewriter') {
      if (isVisible && typingIndex < texts[currentIndex].length) {
        const typingTimer = setTimeout(() => {
          setDisplayText(texts[currentIndex].substring(0, typingIndex + 1));
          setTypingIndex(prev => prev + 1);
        }, 100);
        return () => clearTimeout(typingTimer);
      }
    }
  }, [typingIndex, isVisible, currentIndex, texts, animationStyle]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Start transition out
      setIsVisible(false);
      
      setTimeout(() => {
        // Change text and prepare for transition in
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        
        if (animationStyle === 'typewriter') {
          setDisplayText('');
          setTypingIndex(0);
        }
        
        // Transition in
        setIsVisible(true);
      }, 500);
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [texts, interval, animationStyle]);
  
  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-500 inline-block';
    
    switch (animationStyle) {
      case 'slide':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
      case 'flip':
        return `${baseClasses} transform ${isVisible ? 'opacity-100 rotateX-0' : 'opacity-0 rotateX-90'}`;
      case 'typewriter':
        return `${baseClasses} border-r-2 border-flutter pr-1 ${isVisible ? 'border-opacity-100' : 'border-opacity-0'}`;
      case 'fade':
      default:
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`;
    }
  };
  
  return (
    <span className={getAnimationClasses()}>
      {animationStyle === 'typewriter' ? displayText : texts[currentIndex]}
    </span>
  );
};

export default RotatingText;
