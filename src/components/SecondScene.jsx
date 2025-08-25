import { useRef, useState, useEffect } from 'react';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { useRapier } from '@react-three/rapier';


// Draggable Physics Object Component
const DraggablePhysicsObject = ({ position, color, shape }) => {
  const rigidBodyRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState([0, 0]);
  const { rapier, world } = useRapier();

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!isDragging || !rigidBodyRef.current) return;

      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const newX = (x * 6) - dragOffset[0];
      const newY = (y * 4) - dragOffset[1];
      
      // Set position directly on rigid body
      rigidBodyRef.current.setTranslation({ x: newX, y: newY, z: position[2] }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    };

    const handlePointerUp = () => {
      if (isDragging && rigidBodyRef.current) {
        setIsDragging(false);
        // Reset velocity when releasing
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
    };

    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, dragOffset, position, rapier, world]);

  const handlePointerDown = (event) => {
    if (!rigidBodyRef.current) return;
    
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    const worldMouseX = mouseX * 6;
    const worldMouseY = mouseY * 4;
    
    const currentPos = rigidBodyRef.current.translation();
    const offsetX = worldMouseX - currentPos.x;
    const offsetY = worldMouseY - currentPos.y;
    
    setDragOffset([offsetX, offsetY]);
    setIsDragging(true);
    event.stopPropagation();
  };

  const getGeometry = () => {
    switch(shape) {
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'cone':
        return <coneGeometry args={[0.5, 1, 8]} />;
      case 'torus':
        return <torusGeometry args={[0.4, 0.2, 16, 32]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.5]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.5]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const getCollider = () => {
    switch(shape) {
      case 'sphere':
        return 'ball';
      case 'cone':
        return 'hull';
      case 'torus':
        return 'hull';
      case 'octahedron':
        return 'hull';
      case 'dodecahedron':
        return 'hull';
      default:
        return 'cuboid';
    }
  };

  return (
    <RigidBody 
      ref={rigidBodyRef}
      position={position} 
      colliders={getCollider()} 
      restitution={0.4} 
      friction={0.7}
      type={isDragging ? 'kinematicPosition' : 'dynamic'}
    >
      <mesh onPointerDown={handlePointerDown} scale={isDragging ? 1.1 : 1}>
        {getGeometry()}
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={1}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={1}
          metalness={0.2}
        />
      </mesh>
    </RigidBody>
  );
};

// Floor Component
const Floor = () => {
  return (
    <mesh position={[0, -3, -5]} rotation={[-Math.PI / 2, 0, 0]}>
      <boxGeometry args={[10, 10, 0.5]} />
      <meshStandardMaterial color="#ffdbe1" transparent opacity={1} />
    </mesh>
  );
};

// Second Scene with physics
const SecondScene = () => {
  return (
    <>
      <color attach="background" args={['#62c7f0']} />
      <Physics>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        
        {/* Physics Floor */}
        <Floor />
        <CuboidCollider position={[0, -3, -5]} args={[5, 0.5, 5]} />
      
      {/* Draggable physics objects with various shapes */}
      {/* Front row */}
      <DraggablePhysicsObject position={[-5, 2, -5]} color="#ff4757" shape="box" />
      <DraggablePhysicsObject position={[-3, 2, -5]} color="#2ed573" shape="sphere" />
      <DraggablePhysicsObject position={[-1, 2, -5]} color="#3742fa" shape="cone" />
      <DraggablePhysicsObject position={[1, 2, -5]} color="#ffa502" shape="torus" />
      <DraggablePhysicsObject position={[3, 2, -5]} color="#ff6348" shape="octahedron" />
      <DraggablePhysicsObject position={[5, 2, -5]} color="#7bed9f" shape="dodecahedron" />
      
      {/* Middle row */}
      <DraggablePhysicsObject position={[-4, 4, -3]} color="#ff3838" shape="sphere" />
      <DraggablePhysicsObject position={[-2, 4, -3]} color="#70a1ff" shape="box" />
      <DraggablePhysicsObject position={[0, 4, -3]} color="#5352ed" shape="torus" />
      <DraggablePhysicsObject position={[2, 4, -3]} color="#ff9ff3" shape="cone" />
      <DraggablePhysicsObject position={[4, 4, -3]} color="#7bed9f" shape="octahedron" />
      
      {/* Back row */}
      <DraggablePhysicsObject position={[-5, 6, -2]} color="#ff6b6b" shape="dodecahedron" />
      <DraggablePhysicsObject position={[-3, 6, -2]} color="#4ecdc4" shape="box" />
      <DraggablePhysicsObject position={[-1, 6, -2]} color="#45b7d1" shape="sphere" />
      <DraggablePhysicsObject position={[1, 6, -2]} color="#96ceb4" shape="cone" />
      <DraggablePhysicsObject position={[3, 6, -2]} color="#feca57" shape="torus" />
      <DraggablePhysicsObject position={[5, 6, -2]} color="#a8e6cf" shape="octahedron" />
      
      {/* Extra scattered objects */}
      <DraggablePhysicsObject position={[-6, 3, 1]} color="#ff7675" shape="sphere" />
      <DraggablePhysicsObject position={[6, 3, 1]} color="#74b9ff" shape="box" />
      <DraggablePhysicsObject position={[-2, 7, 1]} color="#fd79a8" shape="dodecahedron" />
      <DraggablePhysicsObject position={[2, 7, 1]} color="#fdcb6e" shape="torus" />
      <DraggablePhysicsObject position={[0, 8, 0]} color="#6c5ce7" shape="cone" />
      </Physics>
    </>
  );
};

export default SecondScene;
