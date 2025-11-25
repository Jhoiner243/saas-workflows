# ChatBot SaaS Platform - Production Ready MVP

A modern, production-ready SaaS platform for creating and managing AI chatbots powered by n8n workflows, built with Next.js, Prisma, Socket.io, Redis, and Shadcn UI.

## Features

- 🔐 **Authentication** - Secure user authentication with NextAuth.js and bcrypt
- 👥 **User Roles** - Role-based access control (USER, ADMIN)
- 🤖 **AI Chatbot Management** - Create, edit, and delete chatbots with ease
- ⚡ **n8n Integration** - Automatic workflow creation and webhook management
- 💬 **Real-time Chat** - WebSocket-powered bidirectional messaging
- 🎨 **Modern UI** - Beautiful dashboard and landing page with Shadcn UI
- 🌙 **Dark Mode** - Full dark mode support
- 📊 **Analytics** - Track messages and conversations
- 🔄 **Live Updates** - Real-time message synchronization across clients
- ⚡ **Redis Caching** - High-performance caching layer for improved speed
- 🚦 **Rate Limiting** - Protect your API with Redis-based rate limiting
- 📝 **Structured Logging** - Production-ready logging with Pino
- 🏥 **Health Checks** - Monitor system health and service status

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Shadcn UI, Tailwind CSS v4, Lucide Icons
- **Backend**: Next.js API Routes, Custom Node.js Server
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis with ioredis
- **Authentication**: NextAuth.js with JWT
- **Real-time**: Socket.io for WebSocket connections
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand for client state management
- **Logging**: Pino for structured logging
- **Automation**: n8n workflow integration

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database running
- Redis server running (local or cloud)
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
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32
   
   # Redis
   REDIS_URL="redis://localhost:6379"
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpx prisma generate
   
   # Note: Database migrations are handled via the adapter in Prisma 7
   # The schema will be synced automatically when you run the app
   
   # (Optional) Open Prisma Studio to view data
   pnpx prisma studio
   ```

5. **Set up Redis**
   
   **Option A: Local Redis**
   ```bash
   # Install Redis (macOS)
   brew install redis
   brew services start redis
   
   # Install Redis (Ubuntu)
   sudo apt-get install redis-server
   sudo systemctl start redis
   
   # Install Redis (Windows)
   # Download from https://github.com/microsoftarchive/redis/releases
   ```
   
   **Option B: Cloud Redis**
   - Use [Upstash](https://upstash.com/) or [Redis Cloud](https://redis.com/cloud/)
   - Update `REDIS_URL` in `.env.local`

6. **Create an admin user**
   
   After starting the app, sign up and manually update the user role in the database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

7. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Project Structure

```
saas-n8n/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── chatbots/            # Chatbot CRUD endpoints
│   │   └── health/              # Health check endpoint
│   ├── auth/                    # Auth pages (login, signup)
│   ├── dashboard/               # Dashboard pages
│   └── page.tsx                 # Landing page
├── components/                  # React components
│   ├── chat/                   # Chat interface components
│   ├── dashboard/              # Dashboard components
│   ├── landing/                # Landing page components
│   ├── providers/              # Context providers
│   └── ui/                     # Shadcn UI components
├── lib/                        # Utility libraries
│   ├── auth.ts                 # NextAuth configuration
│   ├── cache.ts                # Redis caching utilities
│   ├── logger.ts               # Pino logger setup
│   ├── n8n-client.ts          # n8n API client
│   ├── password.ts            # Password hashing
│   ├── prisma.ts              # Prisma client
│   ├── rate-limit.ts          # Rate limiting
│   ├── redis.ts               # Redis client
│   └── utils.ts               # Helper functions
├── prisma/                     # Database schema
│   ├── schema.prisma          # Prisma schema
│   └── prisma.config.ts       # Prisma 7 config
├── types/                      # TypeScript types
├── middleware.ts               # Next.js middleware (auth)
└── server.ts                   # Custom server with Socket.io
```

## Usage

### Authentication

1. **Sign Up**: Navigate to `/auth/signup` to create an account
2. **Login**: Use `/auth/login` to access your account
3. **Logout**: Click your profile in the dashboard sidebar

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

## User Roles

### USER (Default)
- Create and manage own chatbots
- Access to dashboard and chat features
- View own analytics

### ADMIN
- All USER permissions
- Access to admin dashboard
- Manage all users
- View platform-wide analytics

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user
- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `POST /api/auth/signout` - Sign out

### Chatbots
- `GET /api/chatbots` - List user's chatbots (cached)
- `POST /api/chatbots` - Create a new chatbot
- `GET /api/chatbots/:id` - Get chatbot details
- `PUT /api/chatbots/:id` - Update chatbot
- `DELETE /api/chatbots/:id` - Delete chatbot

### Messages
- `GET /api/chatbots/:id/messages` - Get message history
- `POST /api/chatbots/:id/messages` - Send a message

### Health
- `GET /api/health` - Check system health

## Caching Strategy

The platform uses Redis for caching:

- **Chatbot Lists**: Cached for 5 minutes, invalidated on create/update/delete
- **Rate Limiting**: Sliding window algorithm
- **Session Data**: Managed by NextAuth

## Rate Limits

- **API**: 100 requests/minute
- **Auth**: 5 requests/minute
- **Messages**: 20 messages/minute

## Development

### Running Prisma Studio
```bash
pnpx prisma studio
```

### Viewing Logs
The custom server logs WebSocket connections and events to the console.

### Monitoring Health
```bash
curl http://localhost:3000/api/health
```

### Building for Production
```bash
pnpm build
pnpm start
```

## Deployment

### Environment Variables
Ensure all environment variables are set in your production environment.

### Database
- Run migrations or use Prisma's db push
- Set up connection pooling for better performance

### Redis
- Use a production Redis instance (Redis Cloud, AWS ElastiCache, etc.)
- Configure persistence and backups

### Security
- Use strong `NEXTAUTH_SECRET`
- Enable HTTPS in production
- Configure CORS appropriately
- Set up rate limiting at the edge (Cloudflare, etc.)

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env.local`
- Verify network connectivity

### Redis Connection Issues
- Ensure Redis is running
- Check REDIS_URL configuration
- Verify Redis is accepting connections

### n8n Integration Issues
- Verify n8n is accessible at N8N_API_URL
- Check N8N_API_KEY is correct
- Ensure n8n API is enabled

### WebSocket Connection Issues
- Check browser console for connection errors
- Ensure custom server is running (not `next dev`)
- Verify port 3000 is not blocked

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

## Performance Optimization

- ✅ Redis caching for frequently accessed data
- ✅ Database indexes on common queries
- ✅ Connection pooling with pg
- ✅ Rate limiting to prevent abuse
- ✅ Efficient WebSocket connections
- ✅ Optimized Prisma queries with proper includes

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based session management
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting on sensitive endpoints
- ✅ Input validation with Zod
- ✅ SQL injection protection via Prisma
- ✅ XSS protection via React

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

