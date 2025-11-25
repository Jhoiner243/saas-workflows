'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Bot, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Stats {
  totalChatbots: number;
  totalMessages: number;
  activeConversations: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalChatbots: 0,
    totalMessages: 0,
    activeConversations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/chatbots');
        const data = await response.json();
        
        const totalChatbots = data.chatbots?.length || 0;
        const totalMessages = data.chatbots?.reduce(
          (sum: number, bot: any) => sum + (bot._count?.messages || 0),
          0
        ) || 0;
        const activeConversations = data.chatbots?.reduce(
          (sum: number, bot: any) => sum + (bot._count?.conversations || 0),
          0
        ) || 0;

        setStats({
          totalChatbots,
          totalMessages,
          activeConversations,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Chatbots',
      value: stats.totalChatbots,
      description: 'Active AI assistants',
      icon: Bot,
      color: 'text-blue-500',
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      description: 'Messages exchanged',
      icon: MessageSquare,
      color: 'text-green-500',
    },
    {
      title: 'Active Conversations',
      value: stats.activeConversations,
      description: 'Ongoing chats',
      icon: Activity,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your ChatBot SaaS platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Create your first chatbot to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="font-medium">Create a Chatbot</h3>
                <p className="text-sm text-muted-foreground">
                  Navigate to the Chatbots page and create your first AI assistant
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="font-medium">Configure n8n Workflow</h3>
                <p className="text-sm text-muted-foreground">
                  The system will automatically create an n8n workflow for your chatbot
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="font-medium">Start Chatting</h3>
                <p className="text-sm text-muted-foreground">
                  Test your chatbot in real-time with WebSocket-powered messaging
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
