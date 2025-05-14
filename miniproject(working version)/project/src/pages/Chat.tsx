import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from '../components/chat/ChatInterface';
import { mockChatMessages } from '../data/mockData';
import { ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { api } from '../services/api';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

   // Auto-scroll to bottom when messages change
   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (text: string) => {
    const newUserMessage: ChatMessage = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    try {
      const response = await api.sendChatMessage(text);
      
      const newAiMessage: ChatMessage = {
        id: uuidv4(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">AI Chat</h1>
        <p className="text-gray-500 mt-1">Get insights about your business and customers</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
          />
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-soft p-4 hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Suggested Questions</h3>
            <div className="space-y-2">
              {[
                "How can I reduce customer churn?",
                "What factors indicate high churn risk?",
                "How can I improve customer loyalty?",
                "What's the best way to re-engage dormant customers?",
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="w-full text-left p-2 bg-gray-50 hover:bg-primary-50 text-sm rounded-lg transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft p-4 hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-800 mb-2">AI Capabilities</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="inline-block mr-2">💡</span>
                <span>Customer churn prediction and analysis</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block mr-2">💡</span>
                <span>Business growth recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block mr-2">💡</span>
                <span>Customer segmentation insights</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block mr-2">💡</span>
                <span>Marketing strategy suggestions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;