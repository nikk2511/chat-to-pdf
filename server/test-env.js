import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './env.local' });

console.log('Environment variables:');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'Not set');
console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('QDRANT_URL:', process.env.QDRANT_URL);
console.log('QDRANT_COLLECTION_NAME:', process.env.QDRANT_COLLECTION_NAME);
