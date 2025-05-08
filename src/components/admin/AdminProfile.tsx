
import { useState } from 'react';
import { User, Mail, Link as LinkIcon, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  avatarUrl: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
}

const AdminProfile = () => {
  const { toast } = useToast();
  
  // Mock profile data
  const initialProfile: ProfileData = {
    name: "Saurabh Gurung",
    title: "Flutter Developer",
    bio: "Passionate Flutter developer with 5+ years of experience building beautiful cross-platform mobile applications. Specialized in creating responsive, user-friendly interfaces with a focus on performance and clean code.",
    email: "saurabh@example.com",
    location: "New Delhi, India",
    avatarUrl: "https://via.placeholder.com/150",
    social: {
      github: "https://github.com/saurabhgurung",
      linkedin: "https://linkedin.com/in/saurabhgurung",
      twitter: "https://twitter.com/saurabhgurung",
      website: "https://saurabhgurung.com",
    }
  };

  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested social properties
    if (name.includes('social.')) {
      const socialKey = name.split('.')[1] as keyof typeof profile.social;
      setProfile(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialKey]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    }, 800);
  };

  const handleUploadResume = () => {
    // This would typically trigger a file input
    toast({
      title: "Resume upload",
      description: "This would open a file upload dialog in a real application."
    });
  };

  const handleUploadAvatar = () => {
    // This would typically trigger a file input
    toast({
      title: "Avatar upload",
      description: "This would open a file upload dialog in a real application."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal information and public profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and bio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={profile.title}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows={5}
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
                  value={profile.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={profile.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatar & Resume */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button onClick={handleUploadAvatar}>Change Avatar</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resume / CV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload your resume or CV to make it available for download on your portfolio.
                </p>
                <Button onClick={handleUploadResume}>Upload Resume</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Connect your social media accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub
              </Label>
              <Input
                id="github"
                name="social.github"
                value={profile.social.github}
                onChange={handleInputChange}
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </Label>
              <Input
                id="linkedin"
                name="social.linkedin"
                value={profile.social.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" /> Twitter
              </Label>
              <Input
                id="twitter"
                name="social.twitter"
                value={profile.social.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" /> Personal Website
              </Label>
              <Input
                id="website"
                name="social.website"
                value={profile.social.website}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSaveProfile} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
};

export default AdminProfile;
