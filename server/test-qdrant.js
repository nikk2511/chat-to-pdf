import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './env.local' });

async function testQdrant() {
  try {
    console.log('Testing Qdrant connection...');
    
    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('Creating vector store...');
    const vectorStore = await QdrantVectorStore.fromDocuments(
      [], // Empty documents array
      embeddings,
      {
        url: process.env.QDRANT_URL || 'http://localhost:6333',
        collectionName: process.env.QDRANT_COLLECTION_NAME || 'langchainjs-testing',
      }
    );

    console.log('✅ Vector store created successfully!');
    console.log('Collection name:', process.env.QDRANT_COLLECTION_NAME || 'langchainjs-testing');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testQdrant();
