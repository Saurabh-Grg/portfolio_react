import { useState } from 'react';
import { Trash2, Edit2, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/hooks/useQueryHooks';
import type { Project } from '@/contexts/PortfolioContext';

const AdminProjects = () => {
  const { toast } = useToast();
  const { data: projects = [], isLoading, error, refetch } = useProjects();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [showForm, setShowForm] = useState(false);

  console.log('📊 [AdminProjects] Rendering with projects:', projects);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`📝 [AdminProjects] Input changed: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProject = () => {
    console.log('➕ [AdminProjects] Opening new project form');
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      tags: [],
      demo_url: '',
      github_url: '',
      featured: false,
    });
    setShowForm(true);
  };

  const handleEditProject = (project: Project) => {
    console.log('✏️ [AdminProjects] Editing project:', project);
    setEditingId(project.id);
    setFormData(project);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      console.warn('⚠️ [AdminProjects] Title is required');
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    console.log('💾 [AdminProjects] Saving project:', formData);

    if (editingId) {
      updateProject(
        { id: editingId, ...formData },
        {
          onSuccess: () => {
            console.log('✅ [AdminProjects] Project updated');
            toast({ title: 'Success', description: 'Project updated successfully!' });
            setShowForm(false);
            setFormData({});
            refetch();
          },
          onError: (err: any) => {
            console.error('❌ [AdminProjects] Update failed:', err);
            toast({
              title: 'Error',
              description: err?.message || 'Failed to update project',
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      createProject(formData as Omit<Project, 'id'>, {
        onSuccess: () => {
          console.log('✅ [AdminProjects] Project created');
          toast({ title: 'Success', description: 'Project created successfully!' });
          setShowForm(false);
          setFormData({});
          refetch();
        },
        onError: (err: any) => {
          console.error('❌ [AdminProjects] Create failed:', err);
          toast({
            title: 'Error',
            description: err?.message || 'Failed to create project',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      console.log('🗑️ [AdminProjects] Deleting project:', id);
      deleteProject(id, {
        onSuccess: () => {
          console.log('✅ [AdminProjects] Project deleted');
          toast({ title: 'Success', description: 'Project deleted successfully!' });
          refetch();
        },
        onError: (err: any) => {
          console.error('❌ [AdminProjects] Delete failed:', err);
          toast({
            title: 'Error',
            description: err?.message || 'Failed to delete project',
            variant: 'destructive',
          });
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={handleAddProject} disabled={isCreating || isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load projects</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Project' : 'New Project'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                disabled={isCreating || isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                disabled={isCreating || isUpdating}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  disabled={isCreating || isUpdating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  name="github_url"
                  value={formData.github_url || ''}
                  onChange={handleInputChange}
                  disabled={isCreating || isUpdating}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData({});
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description?.substring(0, 100)}...</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag, i) => (
                  <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditProject(project)}
                  disabled={isUpdating || isDeleting}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(project.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No projects yet. Create your first project!</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminProjects;
