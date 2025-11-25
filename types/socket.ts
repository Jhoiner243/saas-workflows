export interface SocketEvents {
  // Client to Server
  'message:send': (data: { chatbotId: string; conversationId: string; content: string }) => void;
  'conversation:join': (data: { conversationId: string }) => void;
  'conversation:leave': (data: { conversationId: string }) => void;
  
  // Server to Client
  'message:new': (data: { id: string; content: string; role: 'user' | 'assistant'; createdAt: string }) => void;
  'message:error': (data: { error: string }) => void;
  'typing:start': () => void;
  'typing:stop': () => void;
  'connection:status': (data: { connected: boolean }) => void;
}

export interface ServerToClientEvents {
  'message:new': (data: { id: string; content: string; role: 'user' | 'assistant'; createdAt: string }) => void;
  'message:error': (data: { error: string }) => void;
  'typing:start': () => void;
  'typing:stop': () => void;
}

export interface ClientToServerEvents {
  'message:send': (data: { chatbotId: string; conversationId: string; content: string }) => void;
  'conversation:join': (data: { conversationId: string }) => void;
  'conversation:leave': (data: { conversationId: string }) => void;
}
