// app/components/portfolio/ExperienceSection.tsx
import AnimatedSection from "@/components/animated-section";
import SectionTitle from "@/components/section-title";
import Timeline from "@/components/timeline";

const timelineItems = [
  {
    date: "2022 - Present",
    title: "Senior Flutter Developer",
    company: "InnovateTech Solutions",
    description: "Leading the mobile app development team, architecting scalable Flutter applications, and mentoring junior developers. Implemented CI/CD pipelines and code quality standards."
  },
  {
    date: "2020 - 2022",
    title: "Flutter Developer",
    company: "AppCraft Studios",
    description: "Developed and maintained multiple Flutter applications for clients across various industries. Implemented complex UI designs and integrated with various backend services."
  },
  {
    date: "2019 - 2020",
    title: "Junior App Developer",
    company: "TechStart Inc.",
    description: "Started as a junior developer working on mobile applications. Learned Flutter framework and contributed to multiple projects under senior developers' guidance."
  },
  {
    date: "2018 - 2019",
    title: "UI/UX Design Intern",
    company: "DesignHub",
    description: "Gained experience in mobile app design principles, user research, and prototyping. Created wireframes and interactive prototypes for mobile applications."
  }
];

const ExperienceSection = () => {
  return (
    <AnimatedSection id="experience" className="py-20 md:py-32 bg-secondary/20">
      <div className="container">
        <SectionTitle
          title="My Experience"
          subtitle="My professional journey in mobile app development and design."
        />
        
        <Timeline items={timelineItems} />
      </div>
    </AnimatedSection>
  );
};

export default ExperienceSection;