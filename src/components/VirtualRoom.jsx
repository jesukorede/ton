import React, { useState } from 'react';
import { useMetaverse } from './MetaverseContext';
import Product3DViewer from './Product3DViewer';

function VirtualRoom({ roomId, onExit, products, selectedProduct }) {
  const { participants, messages, sendMessage } = useMetaverse();
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="virtual-room">
      <div className="room-header">
        <h2>Virtual Room: {roomId}</h2>
        <button onClick={onExit}>Exit Room</button>
      </div>
      
      <div className="room-content">
        <div className="product-viewer">
          {selectedProduct ? (
            <Product3DViewer product={selectedProduct} />
          ) : (
            <div className="no-product-selected">
              Select a product to view in 3D
            </div>
          )}
        </div>
        
        <div className="participants-list">
          <h3>Participants ({participants.length})</h3>
          <ul>
            {participants.map(participant => (
              <li key={participant.id}>
                {participant.name}
                {participant.isCurrentUser && ' (You)'}
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-section">
          <div className="messages">
            {messages.map(message => (
              <div key={message.id} className="message">
                <span className="sender">{message.sender}</span>
                <span className="content">{message.content}</span>
                <span className="timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="message-input">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VirtualRoom;