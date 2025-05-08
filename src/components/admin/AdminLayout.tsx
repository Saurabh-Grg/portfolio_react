
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  User, 
  FileText, 
  Star, 
  Clock, 
  MessageSquare, 
  Settings,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout = ({ onLogout }: AdminLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: BarChart },
    { name: 'Profile', href: '/admin/profile', icon: User },
    { name: 'Projects', href: '/admin/projects', icon: FileText },
    { name: 'Skills', href: '/admin/skills', icon: Star },
    { name: 'Experience', href: '/admin/experience', icon: Clock },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/admin');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-center h-16 p-4">
        <h1 className="text-xl font-bold text-gradient">Portfolio Admin</h1>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link 
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors 
                  ${isActive 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <Separator />
      <div className="p-4">
        <div className="grid gap-1">
          <Link 
            to="/" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            View Website
          </Link>
          <Button 
            variant="ghost" 
            className="flex items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-background border-b">
        <Button variant="ghost" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gradient">Portfolio Admin</h1>
        <Button variant="ghost" onClick={() => navigate('/')}>
          <Home className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:w-64 border-r overflow-y-auto">
        <SidebarContent />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto pt-16 lg:pt-0">
          <div className="container py-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
