import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMetaverse } from '../MetaverseContext/MetaverseContext';
import './VirtualRoom.css';

function VirtualRoom({ roomId, onExit, products, selectedProduct }) {
  const { virtualPosition, updatePosition } = useMetaverse();

  return (
    <div className="virtual-room">
      <div className="room-header">
        <h2>Virtual Room: {roomId}</h2>
        <button onClick={onExit} className="exit-button">Exit Room</button>
      </div>
      <div className="virtual-space">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          {/* Add 3D models and interactions here */}
        </Canvas>
        {selectedProduct && (
          <div className="selected-product-view">
            <h3>{selectedProduct.name}</h3>
            <p>{selectedProduct.price} TON</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualRoom;