import { createServer } from 'http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { parse } from 'url';
import { n8nClient } from './lib/n8n-client';
import { prisma } from './lib/prisma';
import type { ClientToServerEvents, ServerToClientEvents } from './types/socket';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a conversation room
    socket.on('conversation:join', async ({ conversationId }) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('conversation:leave', ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // Handle message send
    socket.on('message:send', async ({ chatbotId, conversationId, content }) => {
      try {
        // Emit typing indicator
        io.to(`conversation:${conversationId}`).emit('typing:start');

        // Get chatbot
        const chatbot = await prisma.chatbot.findUnique({
          where: { id: chatbotId },
        });

        if (!chatbot || !chatbot.isActive) {
          socket.emit('message:error', { error: 'Chatbot not found or inactive' });
          io.to(`conversation:${conversationId}`).emit('typing:stop');
          return;
        }

        // Save user message
        const userMessage = await prisma.message.create({
          data: {
            content,
            role: 'user',
            conversationId,
            chatbotId,
          },
        });

        // Broadcast user message to all clients in the conversation
        io.to(`conversation:${conversationId}`).emit('message:new', {
          id: userMessage.id,
          content: userMessage.content,
          role: 'user',
          createdAt: userMessage.createdAt.toISOString(),
        });

        // Trigger n8n workflow
        if (chatbot.n8nWebhookUrl) {
          try {
            const response = await n8nClient.triggerWorkflow(
              chatbot.n8nWebhookUrl,
              content
            );

            // Save assistant response
            const assistantMessage = await prisma.message.create({
              data: {
                content: response.message || 'No response from chatbot',
                role: 'assistant',
                conversationId,
                chatbotId,
              },
            });

            // Stop typing and broadcast assistant message
            io.to(`conversation:${conversationId}`).emit('typing:stop');
            io.to(`conversation:${conversationId}`).emit('message:new', {
              id: assistantMessage.id,
              content: assistantMessage.content,
              role: 'assistant',
              createdAt: assistantMessage.createdAt.toISOString(),
            });
          } catch (error) {
            console.error('Error triggering n8n workflow:', error);
            
            const errorMessage = await prisma.message.create({
              data: {
                content: 'Sorry, I encountered an error processing your message.',
                role: 'assistant',
                conversationId,
                chatbotId,
              },
            });

            io.to(`conversation:${conversationId}`).emit('typing:stop');
            io.to(`conversation:${conversationId}`).emit('message:new', {
              id: errorMessage.id,
              content: errorMessage.content,
              role: 'assistant',
              createdAt: errorMessage.createdAt.toISOString(),
            });
          }
        } else {
          const errorMessage = await prisma.message.create({
            data: {
              content: 'Chatbot is not configured with an n8n workflow.',
              role: 'assistant',
              conversationId,
              chatbotId,
            },
          });

          io.to(`conversation:${conversationId}`).emit('typing:stop');
          io.to(`conversation:${conversationId}`).emit('message:new', {
            id: errorMessage.id,
            content: errorMessage.content,
            role: 'assistant',
            createdAt: errorMessage.createdAt.toISOString(),
          });
        }
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('message:error', { error: 'Failed to send message' });
        io.to(`conversation:${conversationId}`).emit('typing:stop');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket server running`);
  });
});
