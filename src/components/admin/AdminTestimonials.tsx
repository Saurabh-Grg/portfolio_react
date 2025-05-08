
import { useState } from 'react';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Define Testimonial type
interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

const AdminTestimonials = () => {
  const { toast } = useToast();
  
  // Mock testimonials data
  const initialTestimonials: Testimonial[] = [
    {
      id: 1,
      quote: "Saurabh is an exceptional Flutter developer. His attention to detail and ability to create beautiful, performant apps is unmatched. He delivered our project ahead of schedule and exceeded our expectations.",
      author: "Rajiv Sharma",
      role: "CTO",
      company: "TechStart Solutions",
      avatar: "https://via.placeholder.com/100"
    },
    {
      id: 2,
      quote: "Working with Saurabh was a pleasure. He has a deep understanding of Flutter and mobile development best practices. The app he created for us has received amazing feedback from our users.",
      author: "Priya Patel",
      role: "Product Manager",
      company: "InnovateTech",
      avatar: "https://via.placeholder.com/100"
    },
    {
      id: 3,
      quote: "Saurabh's expertise in Flutter helped us transform our idea into a beautiful, functional app. His communication was clear and he was always available to answer questions and make adjustments.",
      author: "Amit Verma",
      role: "Founder",
      company: "MobileFirst Apps",
      avatar: "https://via.placeholder.com/100"
    }
  ];

  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  
  const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>({
    quote: '',
    author: '',
    role: '',
    company: '',
    avatar: ''
  });

  const resetForm = () => {
    setFormData({
      quote: '',
      author: '',
      role: '',
      company: '',
      avatar: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTestimonial = () => {
    const newTestimonial = {
      ...formData,
      id: testimonials.length ? Math.max(...testimonials.map(t => t.id)) + 1 : 1
    };
    
    setTestimonials(prev => [...prev, newTestimonial]);
    toast({
      title: "Testimonial added",
      description: `Testimonial from ${formData.author} has been added.`
    });
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setFormData({
      quote: testimonial.quote,
      author: testimonial.author,
      role: testimonial.role,
      company: testimonial.company || '',
      avatar: testimonial.avatar || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTestimonial = () => {
    if (!currentTestimonial) return;
    
    setTestimonials(prev => prev.map(testimonial => 
      testimonial.id === currentTestimonial.id ? { ...testimonial, ...formData } : testimonial
    ));
    
    toast({
      title: "Testimonial updated",
      description: `Testimonial from ${formData.author} has been updated.`
    });
    resetForm();
    setIsEditDialogOpen(false);
  };

  const handleDeleteClick = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTestimonial = () => {
    if (!currentTestimonial) return;
    
    setTestimonials(prev => prev.filter(testimonial => testimonial.id !== currentTestimonial.id));
    toast({
      title: "Testimonial deleted",
      description: `Testimonial from ${currentTestimonial.author} has been removed.`
    });
    setIsDeleteDialogOpen(false);
  };

  // Function to truncate text
  const truncate = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
          <p className="text-muted-foreground">
            Manage client and peer feedback about your work.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
              <DialogDescription>
                Add a new testimonial from a client or colleague.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quote">Testimonial Quote</Label>
                <Textarea
                  id="quote"
                  name="quote"
                  value={formData.quote}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Author Role/Position</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization (Optional)</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                <Input
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  URL to the author's profile picture
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddTestimonial}>
                Add Testimonial
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="mb-6">
                <svg className="w-8 h-8 text-flutter opacity-50" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-2.209 0-4 1.791-4 4v10c0 2.209 1.791 4 4 4h10c2.209 0 4-1.791 4-4v-10c0-2.209-1.791-4-4-4h-10zM8 14c0-1.103 0.897-2 2-2h10c1.103 0 2 0.897 2 2v10c0 1.103-0.897 2-2 2h-10c-1.103 0-2-0.897-2-2v-10z"></path>
                  <path d="M16.599 20.599l2.001-2.001c1.103-1.103 2.899-1.103 4.001 0l0 0c1.103 1.103 1.103 2.899 0 4.001l-2.001 2.001c-1.103 1.103-2.899 1.103-4.001 0l0 0c-1.103-1.103-1.103-2.899 0-4.001z"></path>
                  <path d="M8.999 12.999l2.001-2.001c1.103-1.103 2.899-1.103 4.001 0l0 0c1.103 1.103 1.103 2.899 0 4.001l-2.001 2.001c-1.103 1.103-2.899 1.103-4.001 0l0 0c-1.103-1.103-1.103-2.899 0-4.001z"></path>
                </svg>
              </div>
              <blockquote className="text-lg mb-6">{truncate(testimonial.quote, 150)}</blockquote>
              <div className="flex items-center">
                {testimonial.avatar ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                    <span className="text-xl font-medium">{testimonial.author.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(testimonial)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(testimonial)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Update the testimonial details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-quote">Testimonial Quote</Label>
              <Textarea
                id="edit-quote"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author Name</Label>
                <Input
                  id="edit-author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Author Role/Position</Label>
                <Input
                  id="edit-role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company/Organization (Optional)</Label>
              <Input
                id="edit-company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-avatar">Avatar URL (Optional)</Label>
              <Input
                id="edit-avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-muted-foreground">
                URL to the author's profile picture
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateTestimonial}>
              Update Testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteTestimonial}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestimonials;
