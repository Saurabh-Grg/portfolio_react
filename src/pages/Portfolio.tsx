"use client";

import Navbar from "@/components/navbar";
import ThemeToggle from "@/components/theme-toggle";
import Footer from "@/components/footer";
import HomeSection from "@/components/portfolio/HomeSection";
import AboutSection from "@/components/portfolio/AboutSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";
import ContactSection from "@/components/portfolio/ContactSection";

const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <Navbar />
      <HomeSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Portfolio;