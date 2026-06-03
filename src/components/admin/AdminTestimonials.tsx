import { useState } from 'react';
import { Trash2, Edit2, Plus, AlertCircle, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from '@/hooks/useQueryHooks';
import type { Testimonial } from '@/contexts/PortfolioContext';

const AdminTestimonials = () => {
  const { toast } = useToast();
  const { data: testimonials = [], isLoading, error, refetch } = useTestimonials();
  const { mutate: createTestimonial, isPending: isCreating } = useCreateTestimonial();
  const { mutate: updateTestimonial, isPending: isUpdating } = useUpdateTestimonial();
  const { mutate: deleteTestimonial, isPending: isDeleting } = useDeleteTestimonial();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});
  const [showForm, setShowForm] = useState(false);

  console.log('📊 [AdminTestimonials] Rendering with testimonials:', testimonials);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`📝 [AdminTestimonials] Input changed: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleAddTestimonial = () => {
    console.log('➕ [AdminTestimonials] Opening new testimonial form');
    setEditingId(null);
    setFormData({
      name: '',
      role: '',
      company: '',
      content: '',
      avatar_url: '',
      rating: 5,
    });
    setShowForm(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    console.log('✏️ [AdminTestimonials] Editing testimonial:', testimonial);
    setEditingId(testimonial.id);
    setFormData(testimonial);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.content) {
      console.warn('⚠️ [AdminTestimonials] Name and content are required');
      toast({
        title: 'Error',
        description: 'Name and content are required',
        variant: 'destructive',
      });
      return;
    }

    console.log('💾 [AdminTestimonials] Saving testimonial:', formData);

    if (editingId) {
      updateTestimonial(
        { id: editingId, ...formData },
        {
          onSuccess: () => {
            console.log('✅ [AdminTestimonials] Testimonial updated');
            toast({ title: 'Success', description: 'Testimonial updated successfully!' });
            setShowForm(false);
            setFormData({});
            refetch();
          },
          onError: (err: any) => {
            console.error('❌ [AdminTestimonials] Update failed:', err);
            toast({
              title: 'Error',
              description: err?.message || 'Failed to update testimonial',
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      createTestimonial(formData as Omit<Testimonial, 'id'>, {
        onSuccess: () => {
          console.log('✅ [AdminTestimonials] Testimonial created');
          toast({ title: 'Success', description: 'Testimonial created successfully!' });
          setShowForm(false);
          setFormData({});
          refetch();
        },
        onError: (err: any) => {
          console.error('❌ [AdminTestimonials] Create failed:', err);
          toast({
            title: 'Error',
            description: err?.message || 'Failed to create testimonial',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      console.log('🗑️ [AdminTestimonials] Deleting testimonial:', id);
      deleteTestimonial(id, {
        onSuccess: () => {
          console.log('✅ [AdminTestimonials] Testimonial deleted');
          toast({ title: 'Success', description: 'Testimonial deleted successfully!' });
          refetch();
        },
        onError: (err: any) => {
          console.error('❌ [AdminTestimonials] Delete failed:', err);
          toast({
            title: 'Error',
            description: err?.message || 'Failed to delete testimonial',
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
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
          <p className="text-muted-foreground">Manage client testimonials and reviews</p>
        </div>
        <Button onClick={handleAddTestimonial} disabled={isCreating || isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load testimonials</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Testimonial' : 'New Testimonial'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  disabled={isCreating || isUpdating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role/Title</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role || ''}
                  onChange={handleInputChange}
                  disabled={isCreating || isUpdating}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company || ''}
                onChange={handleInputChange}
                disabled={isCreating || isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Testimonial</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content || ''}
                onChange={handleInputChange}
                disabled={isCreating || isUpdating}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url || ''}
                onChange={handleInputChange}
                disabled={isCreating || isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <select
                id="rating"
                name="rating"
                value={formData.rating || 5}
                onChange={handleInputChange as any}
                disabled={isCreating || isUpdating}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
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
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  {testimonial.avatar_url && (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-1">
                {[...Array(testimonial.rating || 0)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm italic">"{testimonial.content}"</p>
              <p className="text-xs text-muted-foreground">{testimonial.company}</p>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditTestimonial(testimonial)}
                  disabled={isUpdating || isDeleting}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(testimonial.id)}
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

      {testimonials.length === 0 && !showForm && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No testimonials yet. Add your first one!</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminTestimonials;
