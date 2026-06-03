import { useState } from 'react';
import { Trash2, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  useMessages,
  useMarkMessageAsRead,
  useDeleteMessage,
} from '@/hooks/useQueryHooks';

const AdminMessages = () => {
  const { toast } = useToast();
  const { data: messages = [], isLoading, error, refetch } = useMessages();
  const { mutate: markAsRead, isPending: isMarking } = useMarkMessageAsRead();
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage();

  const [selectedId, setSelectedId] = useState<number | null>(null);

  console.log('📊 [AdminMessages] Rendering with messages:', messages);

  const handleMarkAsRead = (id: number) => {
    console.log(`📝 [AdminMessages] Marking message ${id} as read`);
    markAsRead(id, {
      onSuccess: () => {
        console.log('✅ [AdminMessages] Message marked as read');
        toast({ title: 'Success', description: 'Message marked as read!' });
        refetch();
      },
      onError: (err: any) => {
        console.error('❌ [AdminMessages] Failed to mark as read:', err);
        toast({
          title: 'Error',
          description: err?.message || 'Failed to mark message as read',
          variant: 'destructive',
        });
      },
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      console.log(`🗑️ [AdminMessages] Deleting message ${id}`);
      deleteMessage(id, {
        onSuccess: () => {
          console.log('✅ [AdminMessages] Message deleted');
          toast({ title: 'Success', description: 'Message deleted successfully!' });
          setSelectedId(null);
          refetch();
        },
        onError: (err: any) => {
          console.error('❌ [AdminMessages] Delete failed:', err);
          toast({
            title: 'Error',
            description: err?.message || 'Failed to delete message',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const unreadCount = messages.filter((m: any) => !m.is_read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">Manage contact form submissions</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-lg px-3 py-1">
            {unreadCount} Unread
          </Badge>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load messages</AlertDescription>
        </Alert>
      )}

      {messages.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No messages yet</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-2">
            {messages.map((msg: any) => (
              <Card
                key={msg.id}
                className={`cursor-pointer transition-colors ${
                  selectedId === msg.id ? 'ring-2 ring-primary' : ''
                } ${!msg.is_read ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  console.log('📬 [AdminMessages] Selected message:', msg.id);
                  setSelectedId(msg.id);
                  if (!msg.is_read) {
                    handleMarkAsRead(msg.id);
                  }
                }}
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{msg.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                    </div>
                    {!msg.is_read && (
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0"></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message Details */}
          <div className="lg:col-span-2">
            {selectedId ? (
              (() => {
                const msg = messages.find((m: any) => m.id === selectedId);
                if (!msg) return null;

                return (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{msg.subject}</CardTitle>
                          <CardDescription>{msg.name}</CardDescription>
                        </div>
                        <div className="flex gap-1">
                          {!msg.is_read && (
                            <Badge variant="secondary">Unread</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">From:</p>
                        <p className="text-sm">{msg.email}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Received:</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <p className="text-sm font-semibold">Message:</p>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.message}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        {!msg.is_read && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsRead(msg.id)}
                            disabled={isMarking}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {isMarking ? 'Marking...' : 'Mark as Read'}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(msg.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <p>Select a message to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
