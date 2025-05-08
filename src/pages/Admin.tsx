
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminSkills from '@/components/admin/AdminSkills';
import AdminProfile from '@/components/admin/AdminProfile';
import AdminExperience from '@/components/admin/AdminExperience';
import AdminTestimonials from '@/components/admin/AdminTestimonials';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminMessages from '@/components/admin/AdminMessages';

// Simple authentication context - in a real app, use proper authentication
const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const handleLogin = (credentials: { email: string; password: string }) => {
    // Mock authentication - replace with real authentication later
    if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<AdminLayout onLogout={handleLogout} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default Admin;
