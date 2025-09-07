import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { Document } from '@langchain/core/documents';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './env.local' });

async function setupCollection() {
  try {
    console.log('Setting up Qdrant collection...');
    
    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create a test document
    const testDoc = new Document({
      pageContent: "This is a test document for the Chat with PDF application. It contains sample content to test the vector search functionality.",
      metadata: {
        source: "test-document",
        pageNumber: 1
      }
    });

    console.log('Creating vector store with test document...');
    const vectorStore = await QdrantVectorStore.fromDocuments(
      [testDoc],
      embeddings,
      {
        url: process.env.QDRANT_URL || 'http://localhost:6333',
        collectionName: process.env.QDRANT_COLLECTION_NAME || 'langchainjs-testing',
      }
    );

    console.log('✅ Collection created successfully with test document!');
    console.log('Collection name:', process.env.QDRANT_COLLECTION_NAME || 'langchainjs-testing');
    
    // Test retrieval
    console.log('Testing retrieval...');
    const retriever = vectorStore.asRetriever({ k: 1 });
    const results = await retriever.invoke("test document");
    console.log('✅ Retrieval test successful:', results.length, 'documents found');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

setupCollection();
