import api from './api';
import {
  Profile,
  Project,
  Skill,
  Experience,
  Testimonial,
  Message,
} from '@/contexts/PortfolioContext';

// ==================== Auth Services ====================

export const authService = {
  register: async (email: string, password: string) => {
    console.log('📝 authService.register: Sending request to /auth/register');
    try {
      const response = await api.post('/auth/register', { email, password });
      console.log('✅ authService.register: Success', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService.register: Failed', error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    console.log('📝 authService.login: Sending request to /auth/login');
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ authService.login: Success', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService.login: Failed', error);
      throw error;
    }
  },

  getMe: async () => {
    console.log('📝 authService.getMe: Sending request to /auth/me');
    try {
      const response = await api.get('/auth/me');
      console.log('✅ authService.getMe: Success', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authService.getMe: Failed', error);
      throw error;
    }
  },
};

// ==================== Profile Services ====================

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (profile: Partial<Profile>): Promise<Profile> => {
    const response = await api.put('/profile', profile);
    return response.data.profile;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string; profile: Profile }> => {
    console.log('📸 [profileService] Uploading avatar:', file.name);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      // Don't set Content-Type header for FormData - let browser/axios handle it
      const response = await api.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': undefined,
        },
      });
      console.log('✅ [profileService] Avatar uploaded successfully:', response.data);
      return {
        avatarUrl: response.data.avatarUrl,
        profile: response.data.profile,
      };
    } catch (error) {
      console.error('❌ [profileService] Avatar upload failed:', error);
      throw error;
    }
  },

  deleteAvatar: async (): Promise<Profile> => {
    console.log('🗑️ [profileService] Deleting avatar');
    const response = await api.delete('/profile/avatar');
    console.log('✅ [profileService] Avatar deleted successfully');
    return response.data.profile;
  },
};

// ==================== Projects Services ====================

export const projectsService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  createProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    const response = await api.post('/projects', project);
    return response.data.project;
  },

  updateProject: async (id: number, project: Partial<Project>): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, project);
    return response.data.project;
  },

  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// ==================== Skills Services ====================

export const skillsService = {
  getSkills: async (): Promise<Skill[]> => {
    const response = await api.get('/skills');
    return response.data;
  },

  createSkill: async (skill: Omit<Skill, 'id'>): Promise<Skill> => {
    const response = await api.post('/skills', skill);
    return response.data.skill;
  },

  updateSkill: async (id: number, skill: Partial<Skill>): Promise<Skill> => {
    const response = await api.put(`/skills/${id}`, skill);
    return response.data.skill;
  },

  deleteSkill: async (id: number): Promise<void> => {
    await api.delete(`/skills/${id}`);
  },
};

// ==================== Experience Services ====================

export const experienceService = {
  getExperience: async (): Promise<Experience[]> => {
    const response = await api.get('/experience');
    return response.data;
  },

  createExperience: async (experience: Omit<Experience, 'id'>): Promise<Experience> => {
    const response = await api.post('/experience', experience);
    return response.data.experience;
  },

  updateExperience: async (id: number, experience: Partial<Experience>): Promise<Experience> => {
    const response = await api.put(`/experience/${id}`, experience);
    return response.data.experience;
  },

  deleteExperience: async (id: number): Promise<void> => {
    await api.delete(`/experience/${id}`);
  },
};

// ==================== Testimonials Services ====================

export const testimonialsService = {
  getTestimonials: async (): Promise<Testimonial[]> => {
    const response = await api.get('/testimonials');
    return response.data;
  },

  createTestimonial: async (testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
    const response = await api.post('/testimonials', testimonial);
    return response.data.testimonial;
  },

  updateTestimonial: async (id: number, testimonial: Partial<Testimonial>): Promise<Testimonial> => {
    const response = await api.put(`/testimonials/${id}`, testimonial);
    return response.data.testimonial;
  },

  deleteTestimonial: async (id: number): Promise<void> => {
    await api.delete(`/testimonials/${id}`);
  },
};

// ==================== Messages Services ====================

export const messagesService = {
  sendMessage: async (message: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message> => {
    const response = await api.post('/messages', message);
    return response.data.data;
  },

  getMessages: async (): Promise<Message[]> => {
    const response = await api.get('/messages');
    return response.data;
  },

  markMessageAsRead: async (id: number): Promise<Message> => {
    const response = await api.patch(`/messages/${id}/read`);
    return response.data.data;
  },

  deleteMessage: async (id: number): Promise<void> => {
    await api.delete(`/messages/${id}`);
  },
};
