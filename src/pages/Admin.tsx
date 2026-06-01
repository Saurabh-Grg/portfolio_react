
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <AdminLogin />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<AdminLayout onLogout={logout} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default Admin;
