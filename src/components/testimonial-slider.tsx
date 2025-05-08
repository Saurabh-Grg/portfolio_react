
import { useState, useEffect } from 'react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

const Testimonial = ({ 
  quote, 
  author, 
  role, 
  company, 
  avatar 
}: TestimonialProps) => {
  return (
    <div className="bg-secondary/50 p-6 rounded-xl border border-border">
      <div className="mb-6">
        <svg className="w-8 h-8 text-flutter opacity-50" fill="currentColor" viewBox="0 0 32 32">
          <path d="M10 8c-2.209 0-4 1.791-4 4v10c0 2.209 1.791 4 4 4h10c2.209 0 4-1.791 4-4v-10c0-2.209-1.791-4-4-4h-10zM8 14c0-1.103 0.897-2 2-2h10c1.103 0 2 0.897 2 2v10c0 1.103-0.897 2-2 2h-10c-1.103 0-2-0.897-2-2v-10z"></path>
          <path d="M16.599 20.599l2.001-2.001c1.103-1.103 2.899-1.103 4.001 0l0 0c1.103 1.103 1.103 2.899 0 4.001l-2.001 2.001c-1.103 1.103-2.899 1.103-4.001 0l0 0c-1.103-1.103-1.103-2.899 0-4.001z"></path>
          <path d="M8.999 12.999l2.001-2.001c1.103-1.103 2.899-1.103 4.001 0l0 0c1.103 1.103 1.103 2.899 0 4.001l-2.001 2.001c-1.103 1.103-2.899 1.103-4.001 0l0 0c-1.103-1.103-1.103-2.899 0-4.001z"></path>
        </svg>
      </div>
      <blockquote className="text-lg mb-6">{quote}</blockquote>
      <div className="flex items-center">
        {avatar ? (
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img 
              src={avatar} 
              alt={author} 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
            <span className="text-xl font-medium">{author.charAt(0)}</span>
          </div>
        )}
        <div>
          <div className="font-medium">{author}</div>
          <div className="text-sm text-muted-foreground">
            {role}{company && `, ${company}`}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TestimonialSliderProps {
  testimonials: TestimonialProps[];
}

const TestimonialSlider = ({ testimonials }: TestimonialSliderProps) => {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <Testimonial {...testimonial} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              current === index 
                ? 'bg-flutter w-6' 
                : 'bg-muted-foreground'
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
