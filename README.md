# ChatBot SaaS Platform - MVP

A modern SaaS platform for creating and managing AI chatbots powered by n8n workflows, built with Next.js, Prisma, Socket.io, and Shadcn UI.

## Features

- 🤖 **AI Chatbot Management** - Create, edit, and delete chatbots with ease
- ⚡ **n8n Integration** - Automatic workflow creation and webhook management
- 💬 **Real-time Chat** - WebSocket-powered bidirectional messaging
- 🎨 **Modern UI** - Beautiful dashboard built with Shadcn UI and Tailwind CSS
- 🌙 **Dark Mode** - Full dark mode support
- 📊 **Analytics** - Track messages and conversations
- 🔄 **Live Updates** - Real-time message synchronization across clients

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Shadcn UI, Tailwind CSS v4, Lucide Icons
- **Backend**: Next.js API Routes, Custom Node.js Server
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io for WebSocket connections
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand for client state management
- **Automation**: n8n workflow integration

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database running
- n8n instance (self-hosted or cloud) with API access
- pnpm package manager

## Installation

1. **Clone the repository**
   ```bash
   cd saas-n8n
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/saas_chatbot?schema=public"
   
   # n8n Integration
   N8N_API_URL="http://localhost:5678/api/v1"
   N8N_API_KEY="your-n8n-api-key"
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # (Optional) Open Prisma Studio to view data
   npx prisma studio
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Project Structure

```
saas-n8n/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   └── chatbots/            # Chatbot CRUD endpoints
│   ├── dashboard/               # Dashboard pages
│   │   ├── chatbots/           # Chatbot management
│   │   └── layout.tsx          # Dashboard layout
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                  # React components
│   ├── chat/                   # Chat interface components
│   ├── dashboard/              # Dashboard components
│   ├── providers/              # Context providers
│   └── ui/                     # Shadcn UI components
├── lib/                        # Utility libraries
│   ├── n8n-client.ts          # n8n API client
│   ├── prisma.ts              # Prisma client
│   └── utils.ts               # Helper functions
├── prisma/                     # Database schema
│   └── schema.prisma          # Prisma schema
├── types/                      # TypeScript types
│   ├── chatbot.ts             # Chatbot types
│   └── socket.ts              # Socket.io types
├── server.ts                   # Custom server with Socket.io
└── package.json               # Dependencies
```

## Usage

### Creating a Chatbot

1. Navigate to the Dashboard
2. Click "Chatbots" in the sidebar
3. Click "Create Chatbot"
4. Fill in the name and description
5. Click "Create Chatbot"

The system will automatically:
- Create a chatbot record in the database
- Generate an n8n workflow
- Set up webhook endpoints
- Activate the chatbot

### Chatting with a Chatbot

1. Click on a chatbot card
2. Use the chat interface to send messages
3. Messages are sent via WebSocket to the n8n workflow
4. Responses are received in real-time

### Managing Chatbots

- **Edit**: Click the three-dot menu on a chatbot card
- **Activate/Deactivate**: Toggle chatbot status
- **Delete**: Remove chatbot and associated n8n workflow

## n8n Workflow Structure

Each chatbot gets an n8n workflow with:

1. **Webhook Trigger** - Receives messages from the platform
2. **Process Message** - Processes the incoming message
3. **Respond to Webhook** - Sends response back to the platform

You can customize the workflow in n8n to add:
- AI model integration (OpenAI, Anthropic, etc.)
- Database lookups
- External API calls
- Complex business logic

## WebSocket Events

### Client to Server
- `conversation:join` - Join a conversation room
- `conversation:leave` - Leave a conversation room
- `message:send` - Send a message

### Server to Client
- `message:new` - New message received
- `typing:start` - Bot is typing
- `typing:stop` - Bot stopped typing
- `message:error` - Error occurred

## API Endpoints

### Chatbots
- `GET /api/chatbots` - List all chatbots
- `POST /api/chatbots` - Create a new chatbot
- `GET /api/chatbots/:id` - Get chatbot details
- `PUT /api/chatbots/:id` - Update chatbot
- `DELETE /api/chatbots/:id` - Delete chatbot

### Messages
- `GET /api/chatbots/:id/messages` - Get message history
- `POST /api/chatbots/:id/messages` - Send a message

## Development

### Running Prisma Studio
```bash
npx prisma studio
```

### Viewing Logs
The custom server logs WebSocket connections and events to the console.

### Building for Production
```bash
pnpm build
pnpm start
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env.local`
- Run `npx prisma db push` to sync schema

### n8n Integration Issues
- Verify n8n is accessible at N8N_API_URL
- Check N8N_API_KEY is correct
- Ensure n8n API is enabled

### WebSocket Connection Issues
- Check browser console for connection errors
- Ensure custom server is running (not `next dev`)
- Verify port 3000 is not blocked

## Future Enhancements

- [ ] User authentication with NextAuth.js
- [ ] Multi-tenancy support
- [ ] Advanced analytics dashboard
- [ ] Chatbot templates
- [ ] Custom branding per chatbot
- [ ] Export conversation history
- [ ] Rate limiting
- [ ] API key management for external integrations

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
