'use client';

import { ChatInterface } from '@/components/chat/chat-interface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Chatbot, Message } from '@/types/chatbot';
import { ArrowLeft, Bot, Calendar, MessageSquare } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ChatbotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatbotId = params.id as string;

  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [conversationId, setConversationId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChatbot() {
      try {
        const response = await fetch(`/api/chatbots/${chatbotId}`);
        if (!response.ok) throw new Error('Failed to fetch chatbot');
        
        const data = await response.json();
        setChatbot(data.chatbot);

        // Create or get conversation
        const messagesResponse = await fetch(`/api/chatbots/${chatbotId}/messages`);
        const messagesData = await messagesResponse.json();
        
        if (messagesData.messages && messagesData.messages.length > 0) {
          setMessages(messagesData.messages);
          setConversationId(messagesData.messages[0].conversationId);
        } else {
          // Create new conversation by sending first message
          setConversationId(`temp-${Date.now()}`);
        }
      } catch (error) {
        console.error('Error fetching chatbot:', error);
        toast.error('Failed to load chatbot');
      } finally {
        setLoading(false);
      }
    }

    fetchChatbot();
  }, [chatbotId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 animate-pulse text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Chatbot not found</p>
          <Button onClick={() => router.push('/dashboard/chatbots')} className="mt-4">
            Back to Chatbots
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard/chatbots')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{chatbot.name}</h1>
          <p className="text-muted-foreground">
            {chatbot.description || 'No description'}
          </p>
        </div>
        <Badge variant={chatbot.isActive ? 'default' : 'secondary'}>
          {chatbot.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Chat</CardTitle>
              <CardDescription>
                Test your chatbot in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface
                chatbotId={chatbotId}
                conversationId={conversationId}
                initialMessages={messages}
              />
            </CardContent>
          </Card>
        </div>

        {/* Chatbot Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Chatbot ID</p>
                  <p className="text-sm text-muted-foreground font-mono">{chatbot.id.slice(0, 8)}...</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(chatbot.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {chatbot.n8nWorkflowId && (
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">n8n Workflow</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {chatbot.n8nWorkflowId.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
