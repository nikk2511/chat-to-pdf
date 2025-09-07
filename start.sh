#!/bin/bash

echo "🚀 Starting Chat with PDF Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if config.env exists
if [ ! -f "server/config.env" ]; then
    echo "⚠️  config.env not found. Creating from template..."
    cp server/config.env server/.env 2>/dev/null || echo "Please create server/.env with your OpenAI API key"
fi

# Start services
echo "📦 Starting Docker services..."
docker-compose up -d valkey qdrant

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if OpenAI API key is set
if grep -q "OPENAI_API_KEY=$" server/.env 2>/dev/null || ! grep -q "OPENAI_API_KEY=" server/.env 2>/dev/null; then
    echo "⚠️  Please set your OpenAI API key in server/.env"
    echo "   Edit server/.env and add: OPENAI_API_KEY=your_key_here"
    echo ""
    echo "🔧 You can start the services manually after setting the API key:"
    echo "   cd server && npm install && npm run dev"
    echo "   cd server && npm run dev:worker (in another terminal)"
    echo "   cd client && npm install && npm run dev"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo "📥 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📥 Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start the server: cd server && npm run dev"
echo "   2. Start the worker: cd server && npm run dev:worker (in another terminal)"
echo "   3. Start the client: cd client && npm run dev"
echo ""
echo "🌐 Access the application at: http://localhost:3000"
echo "🔧 API available at: http://localhost:8000"
