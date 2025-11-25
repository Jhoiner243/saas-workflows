export interface ChatbotConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  [key: string]: any;
}

export interface Chatbot {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  n8nWorkflowId?: string;
  n8nWebhookUrl?: string;
  config?: ChatbotConfig;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
  conversationId: string;
  chatbotId: string;
}

export interface Conversation {
  id: string;
  title?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  chatbotId: string;
  messages?: Message[];
}

export interface CreateChatbotInput {
  name: string;
  description?: string;
  config?: ChatbotConfig;
  n8nWorkflowId?: string;
}

export interface UpdateChatbotInput {
  name?: string;
  description?: string;
  isActive?: boolean;
  config?: ChatbotConfig;
  n8nWorkflowId?: string;
}

export interface SendMessageInput {
  content: string;
  conversationId?: string;
}
