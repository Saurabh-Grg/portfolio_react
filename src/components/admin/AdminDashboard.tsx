
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  FileText, 
  Star, 
  Clock, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data for initial dashboard
const mockDashboardData = {
  totalProjects: 12,
  totalSkills: 18,
  totalExperience: 6,
  totalTestimonials: 8,
  recentMessages: 3,
  projects: [
    { id: 1, title: "Flutter E-commerce App", category: "Mobile App" },
    { id: 2, title: "Personal Finance Tracker", category: "Cross Platform" },
    { id: 3, title: "Health Monitoring System", category: "Mobile App" },
  ],
  recentActivity: [
    { id: 1, action: "Updated project", item: "Flutter E-commerce App", time: "2 hours ago" },
    { id: 2, action: "Added new skill", item: "Firebase", time: "1 day ago" },
    { id: 3, action: "Received new message", item: "From: John Doe", time: "2 days ago" }
  ]
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your portfolio website
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : dashboardData.totalProjects}
            </div>
            <p className="text-xs text-muted-foreground">
              Showcased on your portfolio
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/projects">
              <Button variant="ghost" size="sm" className="gap-1">
                Manage Projects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Skills
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : dashboardData.totalSkills}
            </div>
            <p className="text-xs text-muted-foreground">
              Technologies and abilities
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/skills">
              <Button variant="ghost" size="sm" className="gap-1">
                Manage Skills
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Experience
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : dashboardData.totalExperience}
            </div>
            <p className="text-xs text-muted-foreground">
              Years of professional work
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/experience">
              <Button variant="ghost" size="sm" className="gap-1">
                Manage Experience
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Testimonials
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : dashboardData.totalTestimonials}
            </div>
            <p className="text-xs text-muted-foreground">
              Client and peer feedback
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/testimonials">
              <Button variant="ghost" size="sm" className="gap-1">
                Manage Testimonials
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              dashboardData.projects.map(project => (
                <div key={project.id} className="flex items-center justify-between space-y-0">
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-muted-foreground">{project.category}</p>
                  </div>
                  <Link to={`/admin/projects`}>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Link to="/admin/projects">
              <Button className="w-full">View All Projects</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              dashboardData.recentActivity.map(activity => (
                <div key={activity.id} className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{activity.action}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.item}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
