// app/components/portfolio/TestimonialsSection.tsx
import AnimatedSection from "@/components/animated-section";
import SectionTitle from "@/components/section-title";
import TestimonialSlider from "@/components/testimonial-slider";

const testimonials = [
  {
    quote: "Working with Saurabh was an absolute pleasure. He delivered our app ahead of schedule with exceptional quality and attention to detail.",
    author: "Alex Johnson",
    role: "CTO",
    company: "StartupX"
  },
  {
    quote: "Saurabh's expertise in Flutter helped us transform our idea into a beautiful and functional app. His technical skills and creative approach are impressive.",
    author: "Michelle Lee",
    role: "Product Manager",
    company: "InnovateCorp"
  },
  {
    quote: "I've worked with many developers, but Saurabh stands out with his problem-solving abilities and commitment to quality. He's a true professional.",
    author: "David Chen",
    role: "Founder",
    company: "TechLaunch"
  }
];

const TestimonialsSection = () => {
  return (
    <AnimatedSection id="testimonials" className="py-20 md:py-32">
      <div className="container">
        <SectionTitle
          title="Testimonials"
          subtitle="What clients and colleagues say about working with me."
          center
        />
        
        <div className="max-w-4xl mx-auto">
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </div>
    </AnimatedSection>
  );
};

export default TestimonialsSection;