// pages/chat.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import {Message } from '@prisma/client';

const Chat = () => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const receiverId = process.env.NEXT_PUBLIC_TEACHER_ID; // Remplacez par l'ID réel de l'utilisateur récepteur

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const response = await fetch(`api/messages?chatUserId=${receiverId}`);
    const data = await response.json();
    setMessages(data);
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      await fetch('api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId, content: newMessage }),
      });
      setNewMessage('');
      await fetchMessages();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
         <div id="messages" className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`p-2 rounded-md ${message.senderId === userId ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 self-start'}`}>
              <strong>{message.senderId === userId ? 'You' : 'Other'}:</strong> {message.content}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-300">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
