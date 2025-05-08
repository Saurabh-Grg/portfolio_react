
import { useState } from 'react';
import { Plus, Pencil, Trash, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

// Define Skill type
interface Skill {
  id: number;
  name: string;
  percentage: number;
  category: string;
  icon?: string;
}

const AdminSkills = () => {
  const { toast } = useToast();
  
  // Mock skills data
  const initialSkills: Skill[] = [
    {
      id: 1,
      name: "Flutter",
      percentage: 90,
      category: "Mobile Development",
      icon: "flutter",
    },
    {
      id: 2,
      name: "Dart",
      percentage: 85,
      category: "Programming Languages",
      icon: "dart",
    },
    {
      id: 3,
      name: "Firebase",
      percentage: 80,
      category: "Backend & Database",
      icon: "firebase",
    },
    {
      id: 4,
      name: "REST API",
      percentage: 75,
      category: "Web Development",
      icon: "api",
    },
    {
      id: 5,
      name: "UI/UX Design",
      percentage: 70,
      category: "Design",
      icon: "figma",
    },
  ];

  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
    name: '',
    percentage: 50,
    category: '',
    icon: '',
  });

  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  const resetForm = () => {
    setFormData({
      name: '',
      percentage: 50,
      category: '',
      icon: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({
      ...prev,
      percentage: value[0]
    }));
  };

  const handleAddSkill = () => {
    const newSkill = {
      ...formData,
      id: skills.length ? Math.max(...skills.map(s => s.id)) + 1 : 1
    };
    
    setSkills(prev => [...prev, newSkill]);
    toast({
      title: "Skill added",
      description: `${formData.name} has been added to your skills.`
    });
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (skill: Skill) => {
    setCurrentSkill(skill);
    setFormData({
      name: skill.name,
      percentage: skill.percentage,
      category: skill.category,
      icon: skill.icon || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSkill = () => {
    if (!currentSkill) return;
    
    setSkills(prev => prev.map(skill => 
      skill.id === currentSkill.id ? { ...skill, ...formData } : skill
    ));
    
    toast({
      title: "Skill updated",
      description: `${formData.name} has been updated.`
    });
    resetForm();
    setIsEditDialogOpen(false);
  };

  const handleDeleteClick = (skill: Skill) => {
    setCurrentSkill(skill);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSkill = () => {
    if (!currentSkill) return;
    
    setSkills(prev => prev.filter(skill => skill.id !== currentSkill.id));
    toast({
      title: "Skill deleted",
      description: `${currentSkill.name} has been removed.`
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
          <p className="text-muted-foreground">
            Manage your technical skills and competencies.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
              <DialogDescription>
                Add a new skill to showcase on your portfolio.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Skill Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="col-span-3"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map((category, index) => (
                    <option key={index} value={category} />
                  ))}
                </datalist>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="percentage" className="text-right">Proficiency</Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Slider
                    id="percentage"
                    value={[formData.percentage]}
                    onValueChange={handleSliderChange}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{formData.percentage}%</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">Icon</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Optional: icon name or URL"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddSkill}>
                Add Skill
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Skills Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>{skill.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-flutter to-tech-accent"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs">{skill.percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(skill)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(skill)}>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>
              Update skill details and proficiency level.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Skill Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">Category</Label>
              <Input
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="col-span-3"
                list="edit-categories"
              />
              <datalist id="edit-categories">
                {categories.map((category, index) => (
                  <option key={index} value={category} />
                ))}
              </datalist>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-percentage" className="text-right">Proficiency</Label>
              <div className="col-span-3 flex items-center gap-4">
                <Slider
                  id="edit-percentage"
                  value={[formData.percentage]}
                  onValueChange={handleSliderChange}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="w-12 text-center">{formData.percentage}%</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-icon" className="text-right">Icon</Label>
              <Input
                id="edit-icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Optional: icon name or URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateSkill}>
              Update Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this skill? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteSkill}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSkills;
