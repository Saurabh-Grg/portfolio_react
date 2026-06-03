import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authService,
  profileService,
  projectsService,
  skillsService,
  experienceService,
  testimonialsService,
  messagesService,
} from '@/lib/services';
import type {
  Profile,
  Project,
  Skill,
  Experience,
  Testimonial,
  Message,
} from '@/contexts/PortfolioContext';

// ==================== Query Keys ====================
// Centralized query keys for better cache management

export const queryKeys = {
  profile: ['profile'],
  projects: ['projects'],
  skills: ['skills'],
  experience: ['experience'],
  testimonials: ['testimonials'],
  messages: ['messages'],
} as const;

// ==================== PROFILE HOOKS ====================

export const useProfile = () => {
  console.log('🔍 [useProfile] Initializing profile query');
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      console.log('📡 [useProfile] Fetching profile from API...');
      try {
        const data = await profileService.getProfile();
        console.log('✅ [useProfile] Successfully fetched profile:', data);
        return data;
      } catch (error) {
        console.error('❌ [useProfile] Failed to fetch profile:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useUpdateProfile] Initializing update mutation');

  return useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      console.log('📝 [useUpdateProfile] Updating profile with data:', profile);
      try {
        const data = await profileService.updateProfile(profile);
        console.log('✅ [useUpdateProfile] Profile updated successfully:', data);
        return data;
      } catch (error) {
        console.error('❌ [useUpdateProfile] Failed to update profile:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🔄 [useUpdateProfile] Invalidating profile cache and updating UI');
      queryClient.setQueryData(queryKeys.profile, data);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    onError: (error) => {
      console.error('⚠️ [useUpdateProfile] Mutation error:', error);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useUploadAvatar] Initializing avatar upload mutation');

  return useMutation({
    mutationFn: async (file: File) => {
      console.log('📸 [useUploadAvatar] Uploading avatar file:', file.name);
      try {
        const data = await profileService.uploadAvatar(file);
        console.log('✅ [useUploadAvatar] Avatar uploaded successfully:', data);
        return data;
      } catch (error) {
        console.error('❌ [useUploadAvatar] Failed to upload avatar:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🔄 [useUploadAvatar] Invalidating profile cache');
      queryClient.setQueryData(queryKeys.profile, data.profile);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    onError: (error) => {
      console.error('⚠️ [useUploadAvatar] Mutation error:', error);
    },
  });
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useDeleteAvatar] Initializing avatar delete mutation');

  return useMutation({
    mutationFn: async () => {
      console.log('🗑️ [useDeleteAvatar] Deleting avatar');
      try {
        const data = await profileService.deleteAvatar();
        console.log('✅ [useDeleteAvatar] Avatar deleted successfully');
        return data;
      } catch (error) {
        console.error('❌ [useDeleteAvatar] Failed to delete avatar:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🔄 [useDeleteAvatar] Invalidating profile cache');
      queryClient.setQueryData(queryKeys.profile, data);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    onError: (error) => {
      console.error('⚠️ [useDeleteAvatar] Mutation error:', error);
    },
  });
};

// ==================== PROJECTS HOOKS ====================

export const useProjects = () => {
  console.log('🔍 [useProjects] Initializing projects query');
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: async () => {
      console.log('📡 [useProjects] Fetching projects from API...');
      try {
        const data = await projectsService.getProjects();
        console.log('✅ [useProjects] Successfully fetched projects:', data);
        return data;
      } catch (error) {
        console.error('❌ [useProjects] Failed to fetch projects:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useCreateProject] Initializing create mutation');

  return useMutation({
    mutationFn: async (project: Omit<Project, 'id'>) => {
      console.log('📝 [useCreateProject] Creating project with data:', project);
      try {
        const data = await projectsService.createProject(project);
        console.log('✅ [useCreateProject] Project created successfully:', data);
        return data;
      } catch (error) {
        console.error('❌ [useCreateProject] Failed to create project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useCreateProject] Invalidating projects cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useUpdateProject] Initializing update mutation');

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Project>) => {
      console.log(`📝 [useUpdateProject] Updating project ${id} with data:`, data);
      try {
        const result = await projectsService.updateProject(id, data);
        console.log('✅ [useUpdateProject] Project updated successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ [useUpdateProject] Failed to update project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useUpdateProject] Invalidating projects cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useDeleteProject] Initializing delete mutation');

  return useMutation({
    mutationFn: async (id: number) => {
      console.log(`📝 [useDeleteProject] Deleting project ${id}`);
      try {
        await projectsService.deleteProject(id);
        console.log('✅ [useDeleteProject] Project deleted successfully');
      } catch (error) {
        console.error('❌ [useDeleteProject] Failed to delete project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useDeleteProject] Invalidating projects cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

// ==================== SKILLS HOOKS ====================

export const useSkills = () => {
  console.log('🔍 [useSkills] Initializing skills query');
  return useQuery({
    queryKey: queryKeys.skills,
    queryFn: async () => {
      console.log('📡 [useSkills] Fetching skills from API...');
      try {
        const data = await skillsService.getSkills();
        console.log('✅ [useSkills] Successfully fetched skills:', data);
        return data;
      } catch (error) {
        console.error('❌ [useSkills] Failed to fetch skills:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useCreateSkill] Initializing create mutation');

  return useMutation({
    mutationFn: async (skill: Omit<Skill, 'id'>) => {
      console.log('📝 [useCreateSkill] Creating skill with data:', skill);
      try {
        const data = await skillsService.createSkill(skill);
        console.log('✅ [useCreateSkill] Skill created successfully:', data);
        return data;
      } catch (error) {
        console.error('❌ [useCreateSkill] Failed to create skill:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useCreateSkill] Invalidating skills cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.skills });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useUpdateSkill] Initializing update mutation');

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Skill>) => {
      console.log(`📝 [useUpdateSkill] Updating skill ${id} with data:`, data);
      try {
        const result = await skillsService.updateSkill(id, data);
        console.log('✅ [useUpdateSkill] Skill updated successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ [useUpdateSkill] Failed to update skill:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useUpdateSkill] Invalidating skills cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.skills });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useDeleteSkill] Initializing delete mutation');

  return useMutation({
    mutationFn: async (id: number) => {
      console.log(`📝 [useDeleteSkill] Deleting skill ${id}`);
      try {
        await skillsService.deleteSkill(id);
        console.log('✅ [useDeleteSkill] Skill deleted successfully');
      } catch (error) {
        console.error('❌ [useDeleteSkill] Failed to delete skill:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useDeleteSkill] Invalidating skills cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.skills });
    },
  });
};

// ==================== EXPERIENCE HOOKS ====================

export const useExperience = () => {
  console.log('🔍 [useExperience] Initializing experience query');
  return useQuery({
    queryKey: queryKeys.experience,
    queryFn: async () => {
      console.log('📡 [useExperience] Fetching experience from API...');
      try {
        const data = await experienceService.getExperience();
        console.log('✅ [useExperience] Successfully fetched experience:', data);
        return data;
      } catch (error) {
        console.error('❌ [useExperience] Failed to fetch experience:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useCreateExperience] Initializing create mutation');

  return useMutation({
    mutationFn: async (experience: Omit<Experience, 'id'>) => {
      console.log('📝 [useCreateExperience] Creating experience with data:', experience);
      try {
        const data = await experienceService.createExperience(experience);
        console.log('✅ [useCreateExperience] Experience created successfully:', data);
        return data;
      } catch (error) {
        console.error('❌ [useCreateExperience] Failed to create experience:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useCreateExperience] Invalidating experience cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.experience });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useUpdateExperience] Initializing update mutation');

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Experience>) => {
      console.log(`📝 [useUpdateExperience] Updating experience ${id} with data:`, data);
      try {
        const result = await experienceService.updateExperience(id, data);
        console.log('✅ [useUpdateExperience] Experience updated successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ [useUpdateExperience] Failed to update experience:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useUpdateExperience] Invalidating experience cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.experience });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useDeleteExperience] Initializing delete mutation');

  return useMutation({
    mutationFn: async (id: number) => {
      console.log(`📝 [useDeleteExperience] Deleting experience ${id}`);
      try {
        await experienceService.deleteExperience(id);
        console.log('✅ [useDeleteExperience] Experience deleted successfully');
      } catch (error) {
        console.error('❌ [useDeleteExperience] Failed to delete experience:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useDeleteExperience] Invalidating experience cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.experience });
    },
  });
};

// ==================== TESTIMONIALS HOOKS ====================

export const useTestimonials = () => {
  console.log('🔍 [useTestimonials] Initializing testimonials query');
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: async () => {
      console.log('📡 [useTestimonials] Fetching testimonials from API...');
      try {
        const data = await testimonialsService.getTestimonials();
        console.log('✅ [useTestimonials] Successfully fetched testimonials:', data);
        return data;
      } catch (error) {
        console.error('❌ [useTestimonials] Failed to fetch testimonials:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useCreateTestimonial] Initializing create mutation');

  return useMutation({
    mutationFn: async (testimonial: Omit<Testimonial, 'id'>) => {
      console.log('📝 [useCreateTestimonial] Creating testimonial with data:', testimonial);
      try {
        const data = await testimonialsService.createTestimonial(testimonial);
        console.log('✅ [useCreateTestimonial] Testimonial created successfully:', data);
        return data;
      } catch (error) {
        console.error('❌ [useCreateTestimonial] Failed to create testimonial:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useCreateTestimonial] Invalidating testimonials cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials });
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useUpdateTestimonial] Initializing update mutation');

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Testimonial>) => {
      console.log(`📝 [useUpdateTestimonial] Updating testimonial ${id} with data:`, data);
      try {
        const result = await testimonialsService.updateTestimonial(id, data);
        console.log('✅ [useUpdateTestimonial] Testimonial updated successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ [useUpdateTestimonial] Failed to update testimonial:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useUpdateTestimonial] Invalidating testimonials cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useDeleteTestimonial] Initializing delete mutation');

  return useMutation({
    mutationFn: async (id: number) => {
      console.log(`📝 [useDeleteTestimonial] Deleting testimonial ${id}`);
      try {
        await testimonialsService.deleteTestimonial(id);
        console.log('✅ [useDeleteTestimonial] Testimonial deleted successfully');
      } catch (error) {
        console.error('❌ [useDeleteTestimonial] Failed to delete testimonial:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useDeleteTestimonial] Invalidating testimonials cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials });
    },
  });
};

// ==================== MESSAGES HOOKS ====================

export const useMessages = () => {
  console.log('🔍 [useMessages] Initializing messages query');
  return useQuery({
    queryKey: queryKeys.messages,
    queryFn: async () => {
      console.log('📡 [useMessages] Fetching messages from API...');
      try {
        const data = await messagesService.getMessages();
        console.log('✅ [useMessages] Successfully fetched messages:', data);
        return data;
      } catch (error) {
        console.error('❌ [useMessages] Failed to fetch messages:', error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for messages (more frequent updates)
    retry: 3,
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useMarkMessageAsRead] Initializing mark as read mutation');

  return useMutation({
    mutationFn: async (id: number) => {
      console.log(`📝 [useMarkMessageAsRead] Marking message ${id} as read`);
      try {
        const data = await messagesService.markMessageAsRead(id);
        console.log('✅ [useMarkMessageAsRead] Message marked as read:', data);
        return data;
      } catch (error) {
        console.error('❌ [useMarkMessageAsRead] Failed to mark message as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useMarkMessageAsRead] Invalidating messages cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  console.log('🔍 [useDeleteMessage] Initializing delete mutation');

  return useMutation({
    mutationFn: async (id: number) => {
      console.log(`📝 [useDeleteMessage] Deleting message ${id}`);
      try {
        await messagesService.deleteMessage(id);
        console.log('✅ [useDeleteMessage] Message deleted successfully');
      } catch (error) {
        console.error('❌ [useDeleteMessage] Failed to delete message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('🔄 [useDeleteMessage] Invalidating messages cache');
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
};
