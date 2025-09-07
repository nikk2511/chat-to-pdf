'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as React from 'react';

interface Doc {
  pageContent?: string;
  metadata?: {
    loc?: {
      pageNumber?: number;
    };
    source?: string;
  };
}
interface IMessage {
  role: 'assistant' | 'user';
  content?: string;
  documents?: Doc[];
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState<string>('');
  const [messages, setMessages] = React.useState<IMessage[]>([]);

  const handleSendChatMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    try {
      const res = await fetch(
        `http://localhost:8000/chat?message=${encodeURIComponent(message)}`
      );
      const data = await res.json();

      // Add assistant reply
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data?.message,
          documents: data?.docs,
        },
      ]);
    } catch (err) {
      console.error('Error fetching chat response:', err);
    } finally {
      setMessage('');
    }
  };

  return (
    <div className="p-4 pb-24 h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Start a conversation by asking questions about your uploaded PDF!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.documents && msg.documents.length > 0 && (
                  <div className="mt-2 text-xs opacity-75">
                    <details>
                      <summary className="cursor-pointer">View sources</summary>
                      <div className="mt-1 space-y-1">
                        {msg.documents.map((doc, docIndex) => (
                          <div key={docIndex} className="text-xs bg-white bg-opacity-20 p-2 rounded">
                            <div>Page: {doc.metadata?.loc?.pageNumber || 'Unknown'}</div>
                            <div className="truncate">Source: {doc.metadata?.source || 'Unknown'}</div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="fixed bottom-4 left-[30vw] right-4 flex gap-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendChatMessage();
            }
          }}
        />
        <Button onClick={handleSendChatMessage} disabled={!message.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatComponent;
