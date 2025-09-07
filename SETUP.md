# Setup Guide

## Quick Setup (Windows)

1. **Run the setup script:**
   ```cmd
   start.bat
   ```

2. **Set your OpenAI API key:**
   - Edit `server/config.env`
   - Add your API key: `OPENAI_API_KEY=your_key_here`

3. **Start the application:**
   ```cmd
   # Terminal 1 - Start the server
   cd server
   npm run dev

   # Terminal 2 - Start the worker
   cd server
   npm run dev:worker

   # Terminal 3 - Start the client
   cd client
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

## Manual Setup

### Prerequisites
- Node.js 18+
- Docker Desktop
- OpenAI API key

### Step 1: Start Infrastructure
```bash
docker-compose up -d valkey qdrant
```

### Step 2: Configure Environment
```bash
# Copy the example file
cp server/config.env server/.env

# Edit server/.env and add your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 3: Install Dependencies
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### Step 4: Start Services
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Worker
cd server
npm run dev:worker

# Terminal 3 - Client
cd client
npm run dev
```

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY is required"**
   - Make sure you've set your API key in `server/.env`

2. **Docker services not starting**
   - Ensure Docker Desktop is running
   - Try: `docker-compose down && docker-compose up -d`

3. **Port conflicts**
   - Make sure ports 3000, 8000, 6333, and 6379 are available

4. **File upload fails**
   - Check file size (must be < 10MB)
   - Ensure file is a valid PDF

### Getting Help

- Check the logs: `docker-compose logs`
- Verify services: `docker-compose ps`
- Test API: `curl http://localhost:8000/`
