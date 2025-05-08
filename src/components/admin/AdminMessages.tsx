
import { useState } from 'react';
import { Trash, Check, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Define Message type
interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  date: string;
  isRead: boolean;
}

const AdminMessages = () => {
  const { toast } = useToast();
  
  // Mock messages data
  const initialMessages: Message[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+91 98765 43210",
      subject: "Project Inquiry",
      message: "Hello Saurabh, I'm interested in discussing a potential Flutter project for my company. We are looking to build a cross-platform app for inventory management. Please let me know your availability for a call next week.",
      date: "2025-05-05T14:30:00",
      isRead: false
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      subject: "Collaboration Opportunity",
      message: "Hi Saurabh, I saw your portfolio and I'm impressed with your Flutter work. I'm a UI/UX designer and I'd love to collaborate with you on some projects. Please check out my portfolio at example.com/priya and let me know if you're interested.",
      date: "2025-05-03T10:15:00",
      isRead: true
    },
    {
      id: 3,
      name: "Tech Solutions Inc.",
      email: "hiring@techsolutions.com",
      phone: "+91 88776 55443",
      subject: "Job Opportunity",
      message: "Dear Saurabh, We have an exciting opportunity for a Senior Flutter Developer role at our company. Based on your portfolio and experience, we think you would be a great fit. Please let us know if you're interested in discussing this further.",
      date: "2025-05-01T16:45:00",
      isRead: true
    },
    {
      id: 4,
      name: "Alex Chen",
      email: "alex.chen@example.com",
      subject: "App Development Query",
      message: "Hello, I need a Flutter app developed for my startup. It's a fitness tracking app with social features. Can you provide a quote and estimated timeline? I have some wireframes ready to share if you're interested.",
      date: "2025-04-28T09:20:00",
      isRead: false
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  
  const handleViewMessage = (message: Message) => {
    setCurrentMessage(message);
    setIsViewDialogOpen(true);
    
    // Mark as read if not already
    if (!message.isRead) {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, isRead: true } : m
      ));
    }
  };

  const handleDeleteClick = (message: Message) => {
    setCurrentMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMessage = () => {
    if (!currentMessage) return;
    
    setMessages(prev => prev.filter(m => m.id !== currentMessage.id));
    toast({
      title: "Message deleted",
      description: `Message from ${currentMessage.name} has been deleted.`
    });
    setIsDeleteDialogOpen(false);
  };

  const markAsRead = (message: Message) => {
    setMessages(prev => prev.map(m => 
      m.id === message.id ? { ...m, isRead: true } : m
    ));
    
    toast({
      title: "Message marked as read",
      description: `Message from ${message.name} marked as read.`
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncate = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">
            Manage contact form submissions
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-flutter hover:bg-flutter-dark">
            {unreadCount} Unread {unreadCount === 1 ? 'Message' : 'Messages'}
          </Badge>
        )}
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No messages to display</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">From</TableHead>
                  <TableHead className="hidden md:table-cell">Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow 
                    key={message.id}
                    className={message.isRead ? '' : 'font-medium bg-secondary/30'}
                  >
                    <TableCell className="font-medium">
                      <div>{message.name}</div>
                      <div className="text-xs text-muted-foreground">{message.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {message.subject || 'No subject'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {truncate(message.message, 40)}
                    </TableCell>
                    <TableCell>{formatDate(message.date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewMessage(message)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        {!message.isRead && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => markAsRead(message)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(message)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentMessage?.subject || 'Contact Message'}
            </DialogTitle>
            <DialogDescription>
              Message from {currentMessage?.name} on {currentMessage && formatDate(currentMessage.date)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <a 
                  href={`mailto:${currentMessage?.email}`} 
                  className="text-flutter hover:underline"
                >
                  {currentMessage?.email}
                </a>
              </div>
              {currentMessage?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <a 
                    href={`tel:${currentMessage.phone}`} 
                    className="text-flutter hover:underline"
                  >
                    {currentMessage.phone}
                  </a>
                </div>
              )}
            </div>
            
            <div className="bg-secondary p-4 rounded-md mt-2">
              <p className="whitespace-pre-wrap">{currentMessage?.message}</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => window.location.href = `mailto:${currentMessage?.email}`}
            >
              Reply via Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteMessage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;
