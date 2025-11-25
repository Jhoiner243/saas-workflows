#!/bin/bash

# Setup script for SaaS Chatbot Platform
echo "🚀 Setting up SaaS Chatbot Platform..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp ENV_TEMPLATE.md .env.local
    
    # Generate NEXTAUTH_SECRET
    if command -v openssl &> /dev/null; then
        SECRET=$(openssl rand -base64 32)
        sed -i "s/your-nextauth-secret-here-generate-with-openssl-rand-base64-32/$SECRET/" .env.local
        echo "✅ Generated NEXTAUTH_SECRET"
    else
        echo "⚠️  Please manually generate NEXTAUTH_SECRET with: openssl rand -base64 32"
    fi
    
    echo "⚠️  Please update DATABASE_URL, N8N_API_KEY, and REDIS_URL in .env.local"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🔨 Generating Prisma client..."
pnpx prisma generate

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database and n8n credentials"
echo "2. Ensure PostgreSQL and Redis are running"
echo "3. Run 'pnpm dev' to start the development server"
echo "4. Visit http://localhost:3000 to see your app"
