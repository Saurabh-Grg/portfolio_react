import { useState } from 'react';
import { Trash2, Edit2, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  useSkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
} from '@/hooks/useQueryHooks';
import type { Skill } from '@/contexts/PortfolioContext';

const AdminSkills = () => {
  const { toast } = useToast();
  const { data: skills = [], isLoading, error, refetch } = useSkills();
  const { mutate: createSkill, isPending: isCreating } = useCreateSkill();
  const { mutate: updateSkill, isPending: isUpdating } = useUpdateSkill();
  const { mutate: deleteSkill, isPending: isDeleting } = useDeleteSkill();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({});
  const [showForm, setShowForm] = useState(false);

  console.log('📊 [AdminSkills] Rendering with skills:', skills);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`📝 [AdminSkills] Input changed: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'percentage' ? parseInt(value) : value,
    }));
  };

  const handleAddSkill = () => {
    console.log('➕ [AdminSkills] Opening new skill form');
    setEditingId(null);
    setFormData({ name: '', category: 'General', percentage: 0 });
    setShowForm(true);
  };

  const handleEditSkill = (skill: Skill) => {
    console.log('✏️ [AdminSkills] Editing skill:', skill);
    setEditingId(skill.id);
    setFormData(skill);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      console.warn('⚠️ [AdminSkills] Name is required');
      toast({
        title: 'Error',
        description: 'Skill name is required',
        variant: 'destructive',
      });
      return;
    }

    console.log('💾 [AdminSkills] Saving skill:', formData);

    if (editingId) {
      updateSkill(
        { id: editingId, ...formData },
        {
          onSuccess: () => {
            console.log('✅ [AdminSkills] Skill updated');
            toast({ title: 'Success', description: 'Skill updated successfully!' });
            setShowForm(false);
            setFormData({});
            refetch();
          },
          onError: (err: any) => {
            console.error('❌ [AdminSkills] Update failed:', err);
            toast({
              title: 'Error',
              description: err?.message || 'Failed to update skill',
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      createSkill(formData as Omit<Skill, 'id'>, {
        onSuccess: () => {
          console.log('✅ [AdminSkills] Skill created');
          toast({ title: 'Success', description: 'Skill created successfully!' });
          setShowForm(false);
          setFormData({});
          refetch();
        },
        onError: (err: any) => {
          console.error('❌ [AdminSkills] Create failed:', err);
          toast({
            title: 'Error',
            description: err?.message || 'Failed to create skill',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      console.log('🗑️ [AdminSkills] Deleting skill:', id);
      deleteSkill(id, {
        onSuccess: () => {
          console.log('✅ [AdminSkills] Skill deleted');
          toast({ title: 'Success', description: 'Skill deleted successfully!' });
          refetch();
        },
        onError: (err: any) => {
          console.error('❌ [AdminSkills] Delete failed:', err);
          toast({
            title: 'Error',
            description: err?.message || 'Failed to delete skill',
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
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
          <p className="text-muted-foreground">Manage your technical skills</p>
        </div>
        <Button onClick={handleAddSkill} disabled={isCreating || isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load skills</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Skill' : 'New Skill'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                disabled={isCreating || isUpdating}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  disabled={isCreating || isUpdating}
                  placeholder="e.g., Frontend, Backend"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentage">Proficiency %</Label>
                <Input
                  id="percentage"
                  name="percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.percentage || 0}
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

      <div className="space-y-2">
        {skills.map((skill) => (
          <Card key={skill.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold">{skill.name}</p>
                  <p className="text-sm text-muted-foreground">{skill.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <div className="bg-muted h-2 rounded-full">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${skill.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {skill.percentage}%
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditSkill(skill)}
                      disabled={isUpdating || isDeleting}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(skill.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {skills.length === 0 && !showForm && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No skills yet. Add your first skill!</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminSkills;
