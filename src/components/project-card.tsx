
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Github } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoLink?: string;
  githubLink?: string;
  longDescription?: string;
  features?: string[];
}

const ProjectCard = ({
  title,
  description,
  image,
  tags,
  demoLink,
  githubLink,
  longDescription,
  features = []
}: ProjectCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <>
      <div 
        className="rounded-xl overflow-hidden border border-border h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden h-48">
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between mt-auto gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(true)}
              className="flex-1"
            >
              View Details
            </Button>
            <div className="flex gap-2">
              {demoLink && (
                <Button 
                  variant="default"
                  className="bg-flutter hover:bg-flutter-dark"
                  asChild
                >
                  <a href={demoLink} target="_blank" rel="noopener noreferrer">
                    Live Demo
                  </a>
                </Button>
              )}
              {githubLink && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  asChild
                >
                  <a href={githubLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="pt-4">
              <div className="mb-4">
                <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg mb-4" />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mb-4">{longDescription || description}</p>
              
              {features.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-3 mt-6">
                {demoLink && (
                  <Button
                    variant="default"
                    className="bg-flutter hover:bg-flutter-dark"
                    asChild
                  >
                    <a href={demoLink} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  </Button>
                )}
                {githubLink && (
                  <Button
                    variant="outline"
                    asChild
                  >
                    <a href={githubLink} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
