// app/components/portfolio/SkillsSection.tsx
import AnimatedSection from "@/components/animated-section";
import SectionTitle from "@/components/section-title";
import SkillProgress from "@/components/skill-progress";

const SkillsSection = () => {
  return (
    <AnimatedSection id="skills" className="py-20 md:py-32 bg-secondary/20">
      <div className="container">
        <SectionTitle
          title="My Skills"
          subtitle="I specialize in mobile app development with a focus on Flutter and related technologies."
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-bold mb-6">Development</h3>
            <SkillProgress name="Flutter" percentage={95} color="from-flutter to-flutter-light" />
            <SkillProgress name="Dart" percentage={90} color="from-flutter to-flutter-light" delay={200} />
            <SkillProgress name="Firebase" percentage={85} color="from-tech-purple to-tech-accent" delay={400} />
            <SkillProgress name="REST APIs" percentage={80} color="from-tech-purple to-tech-accent" delay={600} />
            <SkillProgress name="State Management" percentage={92} color="from-flutter to-flutter-light" delay={800} />
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Design & Others</h3>
            <SkillProgress name="UI/UX Design" percentage={85} color="from-tech-purple to-tech-accent" />
            <SkillProgress name="Figma" percentage={75} color="from-tech-purple to-tech-accent" delay={200} />
            <SkillProgress name="Node.js" percentage={70} color="from-flutter to-flutter-light" delay={400} />
            <SkillProgress name="Git & GitHub" percentage={88} color="from-flutter to-flutter-light" delay={600} />
            <SkillProgress name="CI/CD" percentage={78} color="from-tech-purple to-tech-accent" delay={800} />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default SkillsSection;