import AnimatedSection from "@/components/animated-section";
import SectionTitle from "@/components/section-title";
import Counter from "@/components/counter";
import profileImage from "@/assets/images/saurabh.png";

const AboutSection = () => {
  return (
    <AnimatedSection id="about" className="py-20 md:py-32">
      <div className="container">
        <SectionTitle
          title="About Me"
          subtitle="A passionate Flutter developer with a keen eye for design and a commitment to creating exceptional mobile experiences."
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-lg mb-6">
              Hello! I'm Saurabh, a Flutter developer specializing in building high-quality mobile applications that deliver smooth user experiences. With a background in both development and design, I bring a unique perspective to every project.
            </p>
            <p className="text-lg mb-6">
              My journey in app development began with a fascination for creating intuitive interfaces that solve real problems. Today, I combine technical expertise with design thinking to craft apps that are both functional and beautiful.
            </p>
            <p className="text-lg mb-8">
              When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, and staying updated with the latest trends in mobile development.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Counter targetValue={4} label="Years Experience" />
              <Counter targetValue={25} label="Projects Completed" />
              <Counter targetValue={15} label="Happy Clients" />
              <Counter targetValue={5} label="Open Source Contributions" />
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden border-2 border-flutter bg-secondary/20">
                <img
                  src={profileImage}
                  alt="Saurabh Gurung"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border-4 border-background p-1 bg-flutter">
                <div className="w-full h-full rounded-full flex items-center justify-center bg-background text-flutter">
                  <span className="font-mono font-bold">SG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default AboutSection;