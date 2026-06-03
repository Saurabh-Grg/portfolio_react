
import { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Twitter, AlertCircle, Loader2, Upload, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useProfile, useUpdateProfile, useUploadAvatar, useDeleteAvatar } from '@/hooks/useQueryHooks';
import type { Profile } from '@/contexts/PortfolioContext';

const AdminProfile = () => {
  const { toast } = useToast();
  const { data: profileData, isLoading, error, refetch } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();
  const { mutate: deleteAvatar, isPending: isDeletingAvatar } = useDeleteAvatar();

  // Local form state
  const [formData, setFormData] = useState<Partial<Profile> | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Avatar upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when profile data arrives
  useEffect(() => {
    console.log('👀 [AdminProfile] Profile data updated:', profileData);
    if (profileData) {
      setFormData(profileData);
      setHasChanges(false);
    }
  }, [profileData]);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    console.log('📁 [AdminProfile] File selected:', file.name, file.size, file.type);
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.warn('⚠️ [AdminProfile] Invalid file type:', file.type);
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, GIF, or WebP image',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.warn('⚠️ [AdminProfile] File too large:', file.size);
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      console.log('👁️ [AdminProfile] Preview created');
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📝 [AdminProfile] File input changed');
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log('📥 [AdminProfile] File dropped');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Upload avatar
  const handleUploadAvatar = () => {
    if (!selectedFile) {
      console.warn('⚠️ [AdminProfile] No file selected for upload');
      return;
    }

    console.log('📸 [AdminProfile] Starting avatar upload:', selectedFile.name);
    uploadAvatar(selectedFile, {
      onSuccess: () => {
        console.log('✅ [AdminProfile] Avatar uploaded successfully');
        toast({
          title: 'Success',
          description: 'Profile picture uploaded successfully!',
          variant: 'default',
        });
        setSelectedFile(null);
        setPreviewUrl('');
        refetch();
      },
      onError: (err: any) => {
        console.error('❌ [AdminProfile] Avatar upload failed:', err);
        const errorMessage = err?.response?.data?.error || err?.message || 'Failed to upload avatar';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Delete avatar
  const handleDeleteAvatar = () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    console.log('🗑️ [AdminProfile] Deleting avatar');
    deleteAvatar(undefined, {
      onSuccess: () => {
        console.log('✅ [AdminProfile] Avatar deleted successfully');
        toast({
          title: 'Success',
          description: 'Profile picture deleted successfully!',
          variant: 'default',
        });
        setSelectedFile(null);
        setPreviewUrl('');
        refetch();
      },
      onError: (err: any) => {
        console.error('❌ [AdminProfile] Avatar delete failed:', err);
        const errorMessage = err?.response?.data?.error || err?.message || 'Failed to delete avatar';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    });
  };

  // Clear selected file
  const handleClearSelection = () => {
    console.log('❌ [AdminProfile] Clearing file selection');
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(`📝 [AdminProfile] Input changed: ${e.target.name} = ${e.target.value}`);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleSaveProfile = async () => {
    if (!formData) {
      console.warn('⚠️ [AdminProfile] No form data to save');
      return;
    }

    console.log('💾 [AdminProfile] Saving profile with data:', formData);

    try {
      updateProfile(formData, {
        onSuccess: (data) => {
          console.log('✅ [AdminProfile] Profile saved successfully:', data);
          setHasChanges(false);
          toast({
            title: 'Success',
            description: 'Profile updated successfully!',
            variant: 'default',
          });
          refetch();
        },
        onError: (err: any) => {
          console.error('❌ [AdminProfile] Error saving profile:', err);
          const errorMessage =
            err?.response?.data?.message || err?.message || 'Failed to save profile';
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        },
      });
    } catch (err) {
      console.error('❌ [AdminProfile] Unexpected error:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error('❌ [AdminProfile] Failed to load profile:', error);
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">Manage your personal information and public profile.</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load profile. Please try again later.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  // No data state
  if (!formData) {
    console.warn('⚠️ [AdminProfile] No profile data available');
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">Manage your personal information and public profile.</p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No profile data available. Please create one first.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal information and public profile.
        </p>
      </div>

      {/* Status indicators */}
      {hasChanges && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You have unsaved changes. Don't forget to save!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and bio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                rows={5}
                disabled={isUpdating}
              />
              <p className="text-xs text-muted-foreground">
                Write a brief description about yourself, your experience, and what you specialize in.
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                disabled={isUpdating}
              />
            </div>
          </CardContent>
        </Card>

        {/* Avatar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload or change your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Current Avatar Display */}
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : formData?.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt={formData.name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <span className="text-xs">No photo</span>
                    </div>
                  )}
                </div>

                {/* Upload Area */}
                {!previewUrl && (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                      dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      disabled={isUploadingAvatar || isDeletingAvatar}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">Drag and drop your image here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (Max 5MB)
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported: JPEG, PNG, GIF, WebP
                    </p>
                  </div>
                )}

                {/* Preview Actions */}
                {previewUrl && (
                  <div className="w-full space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Selected: {selectedFile?.name} ({(selectedFile?.size ?? 0 / 1024).toFixed(2)} KB)
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button
                        onClick={handleUploadAvatar}
                        disabled={isUploadingAvatar || isDeletingAvatar}
                        className="flex-1"
                      >
                        {isUploadingAvatar ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Photo
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleClearSelection}
                        disabled={isUploadingAvatar || isDeletingAvatar}
                        variant="outline"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Delete Avatar Button */}
                {formData?.avatar_url && !previewUrl && (
                  <Button
                    onClick={handleDeleteAvatar}
                    disabled={isUploadingAvatar || isDeletingAvatar}
                    variant="destructive"
                    className="w-full"
                  >
                    {isDeletingAvatar ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Photo
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Connect your social media accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub
              </Label>
              <Input
                id="github"
                name="github_url"
                value={formData.github_url || ''}
                onChange={handleInputChange}
                placeholder="https://github.com/yourusername"
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </Label>
              <Input
                id="linkedin"
                name="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourusername"
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" /> Twitter
              </Label>
              <Input
                id="twitter"
                name="twitter_url"
                value={formData.twitter_url || ''}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourusername"
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website_url"
                value={formData.website_url || ''}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
                disabled={isUpdating}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => refetch()} disabled={isUpdating}>
          Discard Changes
        </Button>
        <Button
          onClick={handleSaveProfile}
          disabled={isUpdating || !hasChanges}
          className="min-w-[120px]"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminProfile;
