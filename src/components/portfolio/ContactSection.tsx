// app/components/portfolio/ContactSection.tsx
import AnimatedSection from "@/components/animated-section";
import SectionTitle from "@/components/section-title";
import ContactForm from "@/components/contact-form";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <AnimatedSection id="contact" className="py-20 md:py-32 bg-secondary/20">
      <div className="container">
        <SectionTitle
          title="Get In Touch"
          subtitle="Have a project in mind or want to discuss opportunities? Feel free to reach out."
          center
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-flutter/10 flex items-center justify-center mr-4">
                  <Mail className="h-5 w-5 text-flutter" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <a href="mailto:saurabh@example.com" className="text-muted-foreground hover:text-flutter transition-colors">
                    saurabh@example.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-flutter/10 flex items-center justify-center mr-4">
                  <Phone className="h-5 w-5 text-flutter" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Phone</h4>
                  <a href="tel:+1234567890" className="text-muted-foreground hover:text-flutter transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
              
              <div className="pt-6">
                <h4 className="font-medium mb-3">Connect with me</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-flutter hover:border-flutter hover:text-background transition-all"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://linkedin.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-flutter hover:border-flutter hover:text-background transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6">Send Me a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ContactSection;