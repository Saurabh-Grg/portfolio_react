import { useState, useRef } from 'react';
import {
  Trash2, Edit2, Plus, AlertCircle, Loader2,
  X, Star, ImageIcon, ExternalLink, Github,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/hooks/useQueryHooks';
import type { Project } from '@/contexts/PortfolioContext';
import api from '@/lib/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${base}${url}`;
};

const parseImages = (images: any): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === 'string') {
    return images.replace(/^\{|\}$/g, '').split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// ─── Image Slider Component ───────────────────────────────────────────────────
interface ImageSliderProps {
  images: string[];
  primaryUrl: string;
  title: string;
  featured?: boolean;
}

const ImageSlider = ({ images, primaryUrl, title, featured }: ImageSliderProps) => {
  // Always start at the primary image index on mount (persists as long as component is mounted)
  const primaryIndex = images.findIndex(img => img === primaryUrl);
  const [currentIndex, setCurrentIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(i => (i - 1 + images.length) % images.length);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(i => (i + 1) % images.length);
  };

  return (
    <div className="relative h-44 bg-muted overflow-hidden group/slider">
      {/* Main image */}
      <img
        src={getImageUrl(images[currentIndex])}
        alt={`${title} screenshot ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-200"
        onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
      />

      {/* Navigation arrows — only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-1 opacity-0 group-hover/slider:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-1 opacity-0 group-hover/slider:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {currentIndex + 1} / {images.length}
          </span>
        </>
      )}

      {/* Featured badge */}
      {featured && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">
          Featured
        </span>
      )}

      {/* Primary badge on first image */}
      {images[currentIndex] === primaryUrl && images.length > 1 && (
        <span className="absolute bottom-2 left-2 bg-blue-500/80 text-white text-xs px-2 py-0.5 rounded">
          Primary
        </span>
      )}
    </div>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProjectWithImages extends Project {
  images?: string[] | string;
}

interface ImageUploadState {
  files: File[];
  previews: string[];
  uploading: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminProjects = () => {
  const { toast } = useToast();
  const { data: projects = [], isLoading, error, refetch } = useProjects();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectWithImages>>({});
  const [showForm, setShowForm] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  const [imageUpload, setImageUpload] = useState<ImageUploadState>({
    files: [], previews: [], uploading: false,
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({});
    setTagsInput('');
    setEditingId(null);
    setImageUpload({ files: [], previews: [], uploading: false });
  };

  const handleAddProject = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', tags: [], demo_url: '', github_url: '', featured: false });
    setTagsInput('');
    setImageUpload({ files: [], previews: [], uploading: false });
    setShowForm(true);
  };

  const handleEditProject = (project: ProjectWithImages) => {
    setEditingId(project.id);
    setFormData(project);
    setTagsInput(project.tags?.join(', ') || '');
    setImageUpload({ files: [], previews: [], uploading: false });
    setShowForm(true);
  };

  // ── Image selection ───────────────────────────────────────────────────────
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validFiles: File[] = [];
    const previews: string[] = [];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        toast({ title: `Skipped "${file.name}"`, description: 'Only JPEG, PNG, GIF, WebP allowed', variant: 'destructive' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: `Skipped "${file.name}"`, description: 'Max 5MB per file', variant: 'destructive' });
        return;
      }
      validFiles.push(file);
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === validFiles.length) {
          setImageUpload((prev) => ({
            ...prev,
            files: [...prev.files, ...validFiles],
            previews: [...prev.previews, ...previews],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const removeSelectedFile = (index: number) => {
    setImageUpload((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
      previews: prev.previews.filter((_, i) => i !== index),
    }));
  };

  // ── Upload images ─────────────────────────────────────────────────────────
  const uploadImages = async (projectId: number): Promise<void> => {
    if (imageUpload.files.length === 0) return;
    setImageUpload((prev) => ({ ...prev, uploading: true }));
    const form = new FormData();
    imageUpload.files.forEach((f) => form.append('images', f));
    try {
      await api.post(`/projects/${projectId}/images`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err: any) {
      toast({ title: 'Image upload failed', description: err?.response?.data?.error || err.message, variant: 'destructive' });
    } finally {
      setImageUpload((prev) => ({ ...prev, uploading: false }));
    }
  };

  const handleDeleteImage = async (project: ProjectWithImages, imageUrl: string) => {
    if (!window.confirm('Remove this image?')) return;
    try {
      await api.delete(`/projects/${project.id}/images`, { data: { imageUrl } });
      toast({ title: 'Image removed' });
      refetch();
    } catch (err: any) {
      toast({ title: 'Failed to remove image', description: err?.response?.data?.error || err.message, variant: 'destructive' });
    }
  };

  const handleSetPrimary = async (project: ProjectWithImages, imageUrl: string) => {
    try {
      await api.patch(`/projects/${project.id}/images/primary`, { imageUrl });
      toast({ title: 'Primary image updated — will show first on refresh' });
      refetch();
    } catch (err: any) {
      toast({ title: 'Failed to set primary image', description: err?.response?.data?.error || err.message, variant: 'destructive' });
    }
  };

  // ── Save project ──────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!formData.title?.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }

    const payload = { ...formData };

    if (editingId) {
      updateProject({ id: editingId, ...payload }, {
        onSuccess: async () => {
          await uploadImages(editingId);
          toast({ title: 'Project updated!' });
          resetForm();
          refetch();
        },
        onError: (err: any) => {
          toast({ title: 'Update failed', description: err?.message, variant: 'destructive' });
        },
      });
    } else {
      createProject(payload as Omit<Project, 'id'>, {
        onSuccess: async (data: any) => {
          const newId = data?.project?.id || data?.id;
          if (newId && imageUpload.files.length > 0) await uploadImages(newId);
          toast({ title: 'Project created!' });
          resetForm();
          refetch();
        },
        onError: (err: any) => {
          toast({ title: 'Create failed', description: err?.message, variant: 'destructive' });
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Delete this project and all its images?')) return;
    deleteProject(id, {
      onSuccess: () => { toast({ title: 'Project deleted.' }); refetch(); },
      onError: (err: any) => { toast({ title: 'Delete failed', description: err?.message, variant: 'destructive' }); },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
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
          <AlertDescription>Failed to load projects.</AlertDescription>
        </Alert>
      )}

      {/* ── Form ── */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Project' : 'New Project'}</CardTitle>
            <CardDescription>Fill in the details and upload screenshots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" value={formData.title || ''} onChange={handleInputChange} disabled={isCreating || isUpdating} placeholder="My Awesome Project" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} disabled={isCreating || isUpdating} rows={4} placeholder="Describe what this project does..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="demo_url">Live Demo URL</Label>
                <Input id="demo_url" name="demo_url" value={formData.demo_url || ''} onChange={handleInputChange} disabled={isCreating || isUpdating} placeholder="https://myapp.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input id="github_url" name="github_url" value={formData.github_url || ''} onChange={handleInputChange} disabled={isCreating || isUpdating} placeholder="https://github.com/you/repo" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" value={tagsInput} onChange={handleTagsChange} disabled={isCreating || isUpdating} placeholder="React, TypeScript, Node.js (comma separated)" />
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, i) => <Badge key={i} variant="secondary">{tag}</Badge>)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={formData.featured || false}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="featured">Feature this project (shown first)</Label>
            </div>

            {/* ── Image Upload Section ── */}
            <div className="space-y-4">
              <div>
                <Label>Project Screenshots</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload multiple screenshots. Set one as primary — it shows first on page refresh. Max 5MB each.
                </p>
              </div>

              {/* Saved images in edit mode */}
              {editingId && parseImages(formData.images).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Saved Images ({parseImages(formData.images).length}) — hover to set primary or delete
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {parseImages(formData.images).map((imgUrl, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border aspect-video bg-muted">
                        <img
                          src={getImageUrl(imgUrl)}
                          alt={`Screenshot ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                        />
                        {imgUrl === formData.image_url && (
                          <span className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {imgUrl !== formData.image_url && (
                            <button
                              onClick={() => handleSetPrimary(formData as ProjectWithImages, imgUrl)}
                              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-full p-1.5"
                              title="Set as primary (shows first on refresh)"
                            >
                              <Star className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteImage(formData as ProjectWithImages, imgUrl)}
                            className="bg-red-500 hover:bg-red-400 text-white rounded-full p-1.5"
                            title="Remove image"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drop zone */}
              <div
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                }`}
              >
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)} />
                <ImageIcon className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium">Drag & drop screenshots here</p>
                <p className="text-sm text-muted-foreground">or click to browse — select multiple at once</p>
                <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, GIF, WebP · Max 5MB each · Up to 10 files</p>
              </div>

              {/* New file previews */}
              {imageUpload.previews.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {imageUpload.previews.length} new image{imageUpload.previews.length > 1 ? 's' : ''} queued for upload
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {imageUpload.previews.map((preview, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border aspect-video bg-muted">
                        <img src={preview} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && parseImages(formData.images).length === 0 && (
                          <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                            Thumbnail
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeSelectedFile(i); }}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-400 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 right-1 text-xs text-white bg-black/50 rounded px-1 truncate">
                          {imageUpload.files[i]?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={isCreating || isUpdating || imageUpload.uploading}>
                {(isCreating || isUpdating || imageUpload.uploading) ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{imageUpload.uploading ? 'Uploading images...' : 'Saving...'}</>
                ) : (
                  editingId ? 'Update Project' : 'Create Project'
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Project Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(projects as ProjectWithImages[]).map((project) => {
          const projectImages = parseImages(project.images);
          // Sort so primary image is always first (persists across refreshes)
          const sortedImages = project.image_url
            ? [project.image_url, ...projectImages.filter(img => img !== project.image_url)]
            : projectImages;

          return (
            <Card key={project.id} className="overflow-hidden">

              {/* Image slider */}
              {sortedImages.length > 0 ? (
                <ImageSlider
                  images={sortedImages}
                  primaryUrl={project.image_url || sortedImages[0]}
                  title={project.title}
                  featured={project.featured}
                />
              ) : (
                <div className="h-32 bg-muted flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground opacity-30" />
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">{project.description}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag, i) => <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>)}
                  </div>
                )}

                <div className="flex gap-3 text-xs text-muted-foreground">
                  {project.demo_url && (
                    <a href={project.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                      <ExternalLink className="h-3 w-3" /> Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                      <Github className="h-3 w-3" /> GitHub
                    </a>
                  )}
                  {sortedImages.length > 0 && (
                    <span className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {sortedImages.length} screenshot{sortedImages.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => handleEditProject(project)} disabled={isUpdating || isDeleting} className="flex-1">
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)} disabled={isDeleting}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {projects.length === 0 && !showForm && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No projects yet. Click "Add Project" to create your first one!</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminProjects;