# Environment Configuration Template
# Copy this to .env.local and update with your actual values

# DATABASE
DATABASE_URL="postgresql://postgres:password@localhost:5432/saas_chatbot?schema=public"

# N8N INTEGRATION
N8N_API_URL="http://localhost:5678/api/v1"
N8N_API_KEY="your-n8n-api-key-here"

# NEXTAUTH
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here-generate-with-openssl-rand-base64-32"

# REDIS (Optional - defaults to localhost:6379)
REDIS_URL="redis://localhost:6379"

# SERVER
PORT=3000
NODE_ENV=development

# LOGGING (Optional)
LOG_LEVEL=debug
