import React, { createContext, useContext, useState } from 'react';

const MetaverseContext = createContext();

export function MetaverseProvider({ children }) {
  const [activeRoom, setActiveRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  const joinRoom = (roomId) => {
    setActiveRoom(roomId);
    // Add current user to participants
    setParticipants(prev => [...prev, {
      id: `user_${Date.now()}`,
      name: 'You',
      isCurrentUser: true
    }]);
  };

  const leaveRoom = () => {
    setActiveRoom(null);
    setParticipants([]);
    setMessages([]);
  };

  const sendMessage = (message) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: 'You',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <MetaverseContext.Provider 
      value={{ 
        activeRoom, 
        participants, 
        messages, 
        joinRoom, 
        leaveRoom, 
        sendMessage 
      }}
    >
      {children}
    </MetaverseContext.Provider>
  );
}

export function useMetaverse() {
  const context = useContext(MetaverseContext);
  if (!context) {
    throw new Error('useMetaverse must be used within a MetaverseProvider');
  }
  return context;
}