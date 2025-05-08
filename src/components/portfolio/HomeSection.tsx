"use client";
// app/components/portfolio/HomeSection.tsx
import { Button } from "@/components/ui/button";
import { Github, Download } from "lucide-react";
import ParticleBackground from "@/components/particle-background";
import RotatingText from "@/components/rotating-text";

const HomeSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center pt-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Hi, I'm <span className="text-gradient-shimmer">Saurabh Gurung</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <RotatingText 
              texts={[
                "Flutter Developer", 
                "UI/UX Enthusiast", 
                "App Architect"
              ]} 
              animationStyle="typewriter"
            />
          </h2>
          <p className="text-lg text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: '600ms' }}>
            I craft exceptional mobile experiences with Flutter.
            From concept to deployment, I bring ideas to life with clean code and beautiful design.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '900ms' }}>
            <Button size="lg" className="bg-flutter hover:bg-flutter-dark hover:scale-105 transition-transform">
              <Download className="mr-2 h-4 w-4" />
              Download CV
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform">
              <a href="#contact">
                Contact Me
              </a>
            </Button>
            <Button size="lg" variant="ghost" asChild className="hover:scale-105 transition-transform">
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="flex flex-col items-center text-sm text-muted-foreground group">
            <span className="mb-2 group-hover:text-flutter transition-colors">Scroll Down</span>
            <svg className="w-5 h-5 group-hover:text-flutter transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
      <ParticleBackground />
    </section>
  );
};

export default HomeSection;