
import { useState } from 'react';
import { Plus, Pencil, Trash, Eye, Link as LinkIcon, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Define Project type
interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  demoUrl: string;
  githubUrl: string;
  technologies: string[];
}

const AdminProjects = () => {
  const { toast } = useToast();
  
  // Mock projects data
  const initialProjects: Project[] = [
    {
      id: 1,
      title: "Flutter E-commerce App",
      description: "A complete e-commerce solution built with Flutter and Firebase.",
      imageUrl: "https://via.placeholder.com/300",
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
      technologies: ["Flutter", "Firebase", "Dart"]
    },
    {
      id: 2,
      title: "Personal Finance Tracker",
      description: "Track your expenses and income with this easy-to-use mobile application.",
      imageUrl: "https://via.placeholder.com/300",
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
      technologies: ["Flutter", "SQLite", "Riverpod"]
    },
    {
      id: 3,
      title: "Health Monitoring System",
      description: "Monitor your health metrics and get insights on your well-being.",
      imageUrl: "https://via.placeholder.com/300",
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
      technologies: ["Flutter", "Firebase", "REST API"]
    }
  ];

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    technologies: []
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      demoUrl: '',
      githubUrl: '',
      technologies: []
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'technologies') {
      // Convert comma-separated values to array
      setFormData(prev => ({
        ...prev,
        technologies: value.split(',').map(tech => tech.trim())
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddProject = () => {
    const newProject = {
      ...formData,
      id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1
    };
    
    setProjects(prev => [...prev, newProject]);
    toast({
      title: "Project added",
      description: `${formData.title} has been added to your projects.`
    });
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      technologies: project.technologies
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProject = () => {
    if (!currentProject) return;
    
    setProjects(prev => prev.map(project => 
      project.id === currentProject.id ? { ...project, ...formData } : project
    ));
    
    toast({
      title: "Project updated",
      description: `${formData.title} has been updated.`
    });
    resetForm();
    setIsEditDialogOpen(false);
  };

  const handleDeleteClick = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProject = () => {
    if (!currentProject) return;
    
    setProjects(prev => prev.filter(project => project.id !== currentProject.id));
    toast({
      title: "Project deleted",
      description: `${currentProject.title} has been removed.`
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your portfolio projects here.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Add a new project to your portfolio. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="demoUrl" className="text-right">Demo URL</Label>
                <Input
                  id="demoUrl"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="githubUrl" className="text-right">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="technologies" className="text-right">Technologies</Label>
                <Input
                  id="technologies"
                  name="technologies"
                  value={formData.technologies.join(', ')}
                  onChange={handleInputChange}
                  placeholder="Comma-separated values: Flutter, Firebase, etc."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddProject}>
                Add Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Links</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span 
                          key={index} 
                          className="bg-secondary text-secondary-foreground text-xs rounded px-2 py-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </a>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                          <Github className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(project)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(project)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to the project details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">Title</Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-imageUrl" className="text-right">Image URL</Label>
              <Input
                id="edit-imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-demoUrl" className="text-right">Demo URL</Label>
              <Input
                id="edit-demoUrl"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-githubUrl" className="text-right">GitHub URL</Label>
              <Input
                id="edit-githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-technologies" className="text-right">Technologies</Label>
              <Input
                id="edit-technologies"
                name="technologies"
                value={formData.technologies.join(', ')}
                onChange={handleInputChange}
                placeholder="Comma-separated values: Flutter, Firebase, etc."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateProject}>
              Update Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
