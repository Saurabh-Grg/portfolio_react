
import { useState } from 'react';
import { Check, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface SettingsData {
  siteTitle: string;
  metaDescription: string;
  enableDarkMode: boolean;
  showProjectCount: boolean;
  showTestimonials: boolean;
  showContactForm: boolean;
  enableMaintenanceMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  showSocialLinks: boolean;
  showBlogSection: boolean;
}

const AdminSettings = () => {
  const { toast } = useToast();
  
  // Mock settings data
  const initialSettings: SettingsData = {
    siteTitle: "Saurabh Gurung | Flutter Developer",
    metaDescription: "Professional Flutter developer portfolio showcasing projects, skills, and experience in mobile app development.",
    enableDarkMode: true,
    showProjectCount: true,
    showTestimonials: true,
    showContactForm: true,
    enableMaintenanceMode: false,
    primaryColor: "#0175C2",
    secondaryColor: "#8B5CF6",
    showSocialLinks: true,
    showBlogSection: false,
  };

  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchChange = (name: keyof SettingsData) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your portfolio settings have been updated successfully."
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure your portfolio website settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure general website settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Input
                id="metaDescription"
                name="metaDescription"
                value={settings.metaDescription}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Brief description for search engines (recommended 150-160 characters)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>
              Customize the appearance of your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableDarkMode">Enable Dark Mode by Default</Label>
              <Switch
                id="enableDarkMode"
                checked={settings.enableDarkMode}
                onCheckedChange={() => handleSwitchChange('enableDarkMode')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primaryColor"
                  name="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={handleInputChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  name="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondaryColor"
                  name="secondaryColor"
                  type="color"
                  value={settings.secondaryColor}
                  onChange={handleInputChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  name="secondaryColor"
                  value={settings.secondaryColor}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Content Settings</CardTitle>
          <CardDescription>
            Control which sections are visible on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showProjectCount">Show Project Counter</Label>
                <Switch
                  id="showProjectCount"
                  checked={settings.showProjectCount}
                  onCheckedChange={() => handleSwitchChange('showProjectCount')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showTestimonials">Display Testimonials</Label>
                <Switch
                  id="showTestimonials"
                  checked={settings.showTestimonials}
                  onCheckedChange={() => handleSwitchChange('showTestimonials')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showContactForm">Show Contact Form</Label>
                <Switch
                  id="showContactForm"
                  checked={settings.showContactForm}
                  onCheckedChange={() => handleSwitchChange('showContactForm')}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showSocialLinks">Show Social Media Links</Label>
                <Switch
                  id="showSocialLinks"
                  checked={settings.showSocialLinks}
                  onCheckedChange={() => handleSwitchChange('showSocialLinks')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showBlogSection">Show Blog Section</Label>
                <Switch
                  id="showBlogSection"
                  checked={settings.showBlogSection}
                  onCheckedChange={() => handleSwitchChange('showBlogSection')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableMaintenanceMode" className="text-destructive">Enable Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Site will be unavailable to visitors</p>
                </div>
                <Switch
                  id="enableMaintenanceMode"
                  checked={settings.enableMaintenanceMode}
                  onCheckedChange={() => handleSwitchChange('enableMaintenanceMode')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          size="lg" 
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? "Saving..." : (
            <>
              <Check className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
