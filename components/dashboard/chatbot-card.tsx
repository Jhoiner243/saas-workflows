'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Chatbot } from '@/types/chatbot';
import { Bot, Edit, MessageSquare, MoreVertical, Power, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ChatbotCardProps {
  chatbot: Chatbot & { _count?: { messages: number; conversations: number } };
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export function ChatbotCard({ chatbot, onDelete, onToggleActive }: ChatbotCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{chatbot.name}</CardTitle>
              <CardDescription className="line-clamp-1">
                {chatbot.description || 'No description'}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/chatbots/${chatbot.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleActive(chatbot.id, !chatbot.isActive)}>
                <Power className="mr-2 h-4 w-4" />
                {chatbot.isActive ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(chatbot.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{chatbot._count?.messages || 0} messages</span>
          </div>
          <div className="flex items-center gap-1">
            <Bot className="h-4 w-4" />
            <span>{chatbot._count?.conversations || 0} conversations</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant={chatbot.isActive ? 'default' : 'secondary'}>
          {chatbot.isActive ? 'Active' : 'Inactive'}
        </Badge>
        <Button asChild size="sm">
          <Link href={`/dashboard/chatbots/${chatbot.id}`}>
            Open Chat
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
