import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  profileService,
  projectsService,
  skillsService,
  experienceService,
  testimonialsService,
  messagesService,
} from '@/lib/services';
import { Profile, Project, Skill, Experience, Testimonial, Message } from '@/contexts/PortfolioContext';

// Query keys for React Query
export const queryKeys = {
  profile: ['profile'],
  projects: ['projects'],
  skills: ['skills'],
  experience: ['experience'],
  testimonials: ['testimonials'],
  messages: ['messages'],
};

// ==================== Profile Hooks ====================

export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: profileService.getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: Partial<Profile>) => profileService.updateProfile(profile),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile, data);
    },
  });
};

// ==================== Projects Hooks ====================

export const useProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: projectsService.getProjects,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project: Omit<Project, 'id'>) => projectsService.createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, project }: { id: number; project: Partial<Project> }) =>
      projectsService.updateProject(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => projectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

// ==================== Skills Hooks ====================

export const useSkills = () => {
  return useQuery({
    queryKey: queryKeys.skills,
    queryFn: skillsService.getSkills,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skill: Omit<Skill, 'id'>) => skillsService.createSkill(skill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, skill }: { id: number; skill: Partial<Skill> }) =>
      skillsService.updateSkill(id, skill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => skillsService.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills });
    },
  });
};

// ==================== Experience Hooks ====================

export const useExperience = () => {
  return useQuery({
    queryKey: queryKeys.experience,
    queryFn: experienceService.getExperience,
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experience: Omit<Experience, 'id'>) =>
      experienceService.createExperience(experience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experience });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, experience }: { id: number; experience: Partial<Experience> }) =>
      experienceService.updateExperience(id, experience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experience });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => experienceService.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experience });
    },
  });
};

// ==================== Testimonials Hooks ====================

export const useTestimonials = () => {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: testimonialsService.getTestimonials,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testimonial: Omit<Testimonial, 'id'>) =>
      testimonialsService.createTestimonial(testimonial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials });
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, testimonial }: { id: number; testimonial: Partial<Testimonial> }) =>
      testimonialsService.updateTestimonial(id, testimonial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => testimonialsService.deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials });
    },
  });
};

// ==================== Messages Hooks ====================

export const useMessages = () => {
  return useQuery({
    queryKey: queryKeys.messages,
    queryFn: messagesService.getMessages,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) =>
      messagesService.sendMessage(message),
    onSuccess: () => {
      // Invalidate messages only if user is authenticated
      const token = localStorage.getItem('authToken');
      if (token) {
        queryClient.invalidateQueries({ queryKey: queryKeys.messages });
      }
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => messagesService.markMessageAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => messagesService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
};
