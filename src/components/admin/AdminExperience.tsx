
import { useState } from 'react';
import { Plus, Pencil, Trash, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Define Experience type
interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  logo?: string;
  isCurrent: boolean;
}

const AdminExperience = () => {
  const { toast } = useToast();
  
  // Mock experience data
  const initialExperiences: Experience[] = [
    {
      id: 1,
      role: "Senior Flutter Developer",
      company: "Tech Solutions Inc.",
      location: "New Delhi, India",
      startDate: "2021-01",
      endDate: "",
      description: "Leading a team of 5 developers to build and maintain enterprise mobile applications. Implementing complex features and ensuring code quality through proper testing and documentation.",
      logo: "https://via.placeholder.com/50",
      isCurrent: true
    },
    {
      id: 2,
      role: "Flutter Developer",
      company: "AppCreators Studio",
      location: "Bengaluru, India",
      startDate: "2018-06",
      endDate: "2020-12",
      description: "Developed and published over 10 mobile applications for iOS and Android using Flutter framework. Collaborated with design and backend teams to deliver high-quality applications.",
      logo: "https://via.placeholder.com/50",
      isCurrent: false
    },
    {
      id: 3,
      role: "Mobile App Developer (Intern)",
      company: "CodeNest Technologies",
      location: "Mumbai, India",
      startDate: "2017-09",
      endDate: "2018-03",
      description: "Assisted in the development of mobile applications. Learned Flutter framework and contributed to real-world projects.",
      logo: "https://via.placeholder.com/50",
      isCurrent: false
    }
  ];

  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    logo: '',
    isCurrent: false
  });

  const resetForm = () => {
    setFormData({
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      logo: '',
      isCurrent: false
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(name === 'isCurrent' && checked ? { endDate: '' } : {})
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddExperience = () => {
    const newExperience = {
      ...formData,
      id: experiences.length ? Math.max(...experiences.map(e => e.id)) + 1 : 1
    };
    
    setExperiences(prev => [...prev, newExperience]);
    toast({
      title: "Experience added",
      description: `${formData.role} at ${formData.company} has been added to your timeline.`
    });
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (experience: Experience) => {
    setCurrentExperience(experience);
    setFormData({
      role: experience.role,
      company: experience.company,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
      description: experience.description,
      logo: experience.logo || '',
      isCurrent: experience.isCurrent
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateExperience = () => {
    if (!currentExperience) return;
    
    setExperiences(prev => prev.map(experience => 
      experience.id === currentExperience.id ? { ...experience, ...formData } : experience
    ));
    
    toast({
      title: "Experience updated",
      description: `${formData.role} at ${formData.company} has been updated.`
    });
    resetForm();
    setIsEditDialogOpen(false);
  };

  const handleDeleteClick = (experience: Experience) => {
    setCurrentExperience(experience);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteExperience = () => {
    if (!currentExperience) return;
    
    setExperiences(prev => prev.filter(experience => experience.id !== currentExperience.id));
    toast({
      title: "Experience deleted",
      description: `${currentExperience.role} at ${currentExperience.company} has been removed.`
    });
    setIsDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const [year, month] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (error) {
      return dateString;
    }
  };

  const getDateRange = (startDate: string, endDate: string, isCurrent: boolean) => {
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
          <p className="text-muted-foreground">
            Manage your work experience and career timeline.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Experience</DialogTitle>
              <DialogDescription>
                Add a new position to your professional experience timeline.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Job Title/Role</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="month"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="month"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    disabled={formData.isCurrent}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="isCurrent"
                  name="isCurrent"
                  type="checkbox"
                  className="w-4 h-4"
                  checked={formData.isCurrent}
                  onChange={handleInputChange}
                />
                <Label htmlFor="isCurrent">I currently work here</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Add a URL to the company logo
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddExperience}>
                Add Experience
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Experience Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.map((experience) => (
                <TableRow key={experience.id}>
                  <TableCell className="font-medium">{experience.role}</TableCell>
                  <TableCell>{experience.company}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {getDateRange(experience.startDate, experience.endDate, experience.isCurrent)}
                    </div>
                  </TableCell>
                  <TableCell>{experience.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(experience)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(experience)}>
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
            <DialogTitle>Edit Experience</DialogTitle>
            <DialogDescription>
              Update details about this professional experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Job Title/Role</Label>
                <Input
                  id="edit-role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company">Company/Organization</Label>
                <Input
                  id="edit-company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  name="startDate"
                  type="month"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  name="endDate"
                  type="month"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  disabled={formData.isCurrent}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id="edit-isCurrent"
                name="isCurrent"
                type="checkbox"
                className="w-4 h-4"
                checked={formData.isCurrent}
                onChange={handleInputChange}
              />
              <Label htmlFor="edit-isCurrent">I currently work here</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logo">Company Logo URL</Label>
              <Input
                id="edit-logo"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add a URL to the company logo
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateExperience}>
              Update Experience
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this experience? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteExperience}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminExperience;
