
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? "py-3 glass" : "py-6 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="#" className="text-2xl font-bold text-gradient">
          Saurabh<span className="font-normal">Gurung</span>
        </a>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span 
                className={`w-full h-0.5 bg-foreground transition-all ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span 
                className={`w-full h-0.5 bg-foreground transition-all ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span 
                className={`w-full h-0.5 bg-foreground transition-all ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </Button>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
          <ul className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="font-medium hover:text-gradient transition-all relative after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-flutter after:origin-bottom-right after:transition-transform hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="fixed inset-0 bg-background/95 z-50 pt-24 glass animate-fade-in">
            <ul className="flex flex-col items-center space-y-6 text-center">
              {navItems.map((item) => (
                <li key={item.name} className="w-full">
                  <a
                    href={item.href}
                    className="text-2xl font-medium block py-3 hover:text-gradient transition-all"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
