import React, { createContext, useContext, useState } from 'react';

const MetaverseContext = createContext();

export function MetaverseProvider({ children }) {
  const [activeRoom, setActiveRoom] = useState(null);
  const [virtualPosition, setVirtualPosition] = useState({ x: 0, y: 0, z: 0 });

  const joinRoom = (roomId) => {
    setActiveRoom(roomId);
  };

  const leaveRoom = () => {
    setActiveRoom(null);
  };

  const updatePosition = (position) => {
    setVirtualPosition(position);
  };

  return (
    <MetaverseContext.Provider 
      value={{ 
        activeRoom, 
        virtualPosition,
        joinRoom, 
        leaveRoom,
        updatePosition 
      }}
    >
      {children}
    </MetaverseContext.Provider>
  );
}

export function useMetaverse() {
  return useContext(MetaverseContext);
}