import { Worker } from 'bullmq';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { CharacterTextSplitter } from '@langchain/textsplitters';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './env.local' });

const worker = new Worker(
  'file-upload-queue',
  async (job) => {
    try {
      console.log(`Processing job:`, job.data);
      const data = JSON.parse(job.data);
      
      // Load the PDF
      const loader = new PDFLoader(data.path);
      const docs = await loader.load();

      // Split documents into chunks for better retrieval
      const textSplitter = new CharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splitDocs = await textSplitter.splitDocuments(docs);

      const embeddings = new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Create or get the vector store
      let vectorStore;
      try {
        vectorStore = await QdrantVectorStore.fromExistingCollection(
          embeddings,
          {
            url: process.env.QDRANT_URL || 'http://localhost:6333',
            collectionName: process.env.QDRANT_COLLECTION_NAME || 'langchainjs-testing',
          }
        );
      } catch (error) {
        // If collection doesn't exist, create it
        console.log('Collection does not exist, creating new one...');
        vectorStore = await QdrantVectorStore.fromDocuments(
          [], // Empty documents array
          embeddings,
          {
            url: process.env.QDRANT_URL || 'http://localhost:6333',
            collectionName: process.env.QDRANT_COLLECTION_NAME || 'langchainjs-testing',
          }
        );
      }
      
      await vectorStore.addDocuments(splitDocs);
      console.log(`Successfully processed ${splitDocs.length} document chunks for file: ${data.filename}`);
    } catch (error) {
      console.error('Worker error:', error);
      throw error; // Re-throw to mark job as failed
    }
  },
  {
    concurrency: 5, // Reduced concurrency for better resource management
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || '6379',
    },
  }
);