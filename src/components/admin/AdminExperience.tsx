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
  useExperience,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from '@/hooks/useQueryHooks';
import type { Experience } from '@/contexts/PortfolioContext';

const AdminExperience = () => {
  const { toast } = useToast();
  const { data: experiences = [], isLoading, error, refetch } = useExperience();
  const { mutate: createExperience, isPending: isCreating } = useCreateExperience();
  const { mutate: updateExperience, isPending: isUpdating } = useUpdateExperience();
  const { mutate: deleteExperience, isPending: isDeleting } = useDeleteExperience();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const [showForm, setShowForm] = useState(false);

  console.log('📊 [AdminExperience] Rendering with experiences:', experiences);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    console.log(`📝 [AdminExperience] Input changed: ${name} = ${value}`);
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddExperience = () => {
    console.log('➕ [AdminExperience] Opening new experience form');
    setEditingId(null);
    setFormData({
      company: '',
      position: '',
      duration: '',
      description: '',
      type: 'work',
      start_date: '',
      end_date: '',
      current: false,
    });
    setShowForm(true);
  };

  const handleEditExperience = (exp: Experience) => {
    console.log('✏️ [AdminExperience] Editing experience:', exp);
    setEditingId(exp.id);
    setFormData(exp);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.company || !formData.position) {
      console.warn('⚠️ [AdminExperience] Company and position are required');
      toast({
        title: 'Error',
        description: 'Company and position are required',
        variant: 'destructive',
      });
      return;
    }

    console.log('💾 [AdminExperience] Saving experience:', formData);

    if (editingId) {
      updateExperience(
        { id: editingId, ...formData },
        {
          onSuccess: () => {
            console.log('✅ [AdminExperience] Experience updated');
            toast({ title: 'Success', description: 'Experience updated successfully!' });
            setShowForm(false);
            setFormData({});
            refetch();
          },
          onError: (err: any) => {
            console.error('❌ [AdminExperience] Update failed:', err);
            toast({
              title: 'Error',
              description: err?.message || 'Failed to update experience',
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      createExperience(formData as Omit<Experience, 'id'>, {
        onSuccess: () => {
          console.log('✅ [AdminExperience] Experience created');
          toast({ title: 'Success', description: 'Experience created successfully!' });
          setShowForm(false);
          setFormData({});
          refetch();
        },
        onError: (err: any) => {
          console.error('❌ [AdminExperience] Create failed:', err);
          toast({
            title: 'Error',
            description: err?.message || 'Failed to create experience',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      console.log('🗑️ [AdminExperience] Deleting experience:', id);
      deleteExperience(id, {
        onSuccess: () => {
          console.log('✅ [AdminExperience] Experience deleted');
          toast({ title: 'Success', description: 'Experience deleted successfully!' });
          refetch();
        },
        onError: (err: any) => {
          console.error('❌ [AdminExperience] Delete failed:', err);
          toast({
            title: 'Error',
            description: err?.message || 'Failed to delete experience',
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
          <p className="text-muted-foreground">Loading experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
          <p className="text-muted-foreground">Manage your work experience and education</p>
        </div>
        <Button onClick={handleAddExperience} disabled={isCreating || isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load experience</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Experience' : 'New Experience'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleInputChange}
                  disabled={isCreating || isUpdating}
                />
              </div>
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
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={handleInputChange}
                  disabled={isCreating || isUpdating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date || ''}
                  onChange={handleInputChange}
                  disabled={isCreating || isUpdating || formData.current}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="current"
                name="current"
                type="checkbox"
                checked={formData.current || false}
                onChange={handleInputChange}
                disabled={isCreating || isUpdating}
              />
              <Label htmlFor="current" className="mb-0">
                Currently working here
              </Label>
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

      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{exp.company}</CardTitle>
                  <CardDescription>{exp.position}</CardDescription>
                </div>
                {exp.current && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                    Current
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{exp.description}</p>
              <p className="text-xs text-muted-foreground">
                {exp.start_date} {exp.end_date ? `- ${exp.end_date}` : '- Present'}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditExperience(exp)}
                  disabled={isUpdating || isDeleting}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(exp.id)}
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

      {experiences.length === 0 && !showForm && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No experience yet. Add your first entry!</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminExperience;
