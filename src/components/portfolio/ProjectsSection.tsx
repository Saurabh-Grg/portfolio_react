// app/components/portfolio/ProjectsSection.tsx
import AnimatedSection from "@/components/animated-section";
import SectionTitle from "@/components/section-title";
import ProjectCard from "@/components/project-card";

const projects = [
  {
    title: "Taskly",
    description: "A productivity app with task management and focus timer",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    tags: ["Flutter", "Firebase", "BLoC"],
    demoLink: "#",
    githubLink: "#",
    longDescription: "Taskly is a comprehensive productivity application built with Flutter that helps users manage tasks, track habits, and stay focused with a built-in pomodoro timer.",
    features: [
      "Task management with categories and priority levels",
      "Pomodoro timer for focused work sessions",
      "Daily streak tracking for habits",
      "Cloud sync with Firebase",
    ]
  },
  {
    title: "FitTrack",
    description: "Fitness tracking app with workout plans and progress charts",
    image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&q=80&w=1000",
    tags: ["Flutter", "Hive", "Provider"],
    demoLink: "#",
    githubLink: "#",
    longDescription: "FitTrack helps users monitor their fitness journey with custom workout plans, progress tracking, and detailed analytics. Built with Flutter and local storage.",
    features: [
      "Custom workout plan builder",
      "Progress tracking with charts",
      "Calorie and macro calculator",
      "Offline support with Hive local database",
    ]
  },
  {
    title: "WeatherNow",
    description: "Weather forecast app with beautiful visualizations",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=1000",
    tags: ["Flutter", "REST API", "GetX"],
    demoLink: "#",
    githubLink: "#",
    longDescription: "WeatherNow provides accurate weather forecasts with beautiful visualizations and animations. It uses multiple weather APIs to ensure data accuracy.",
    features: [
      "7-day weather forecast",
      "Animated weather visualizations",
      "Location-based weather updates",
      "Weather alerts and notifications",
    ]
  },
];

const ProjectsSection = () => {
  return (
    <AnimatedSection id="projects" className="py-20 md:py-32">
      <div className="container">
        <SectionTitle
          title="My Projects"
          subtitle="A selection of my recent work. Each project represents unique challenges and solutions."
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <AnimatedSection 
              key={project.title} 
              animation="scale-in" 
              delay={index * 200}
            >
              <ProjectCard {...project} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ProjectsSection;