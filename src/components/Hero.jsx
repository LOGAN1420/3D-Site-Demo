import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Text, Billboard, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const CarModel = () => {
  const carRef = useRef();
  const { scene, animations } = useGLTF('/Models/Car.glb');
  const { actions } = useAnimations(animations, carRef);
  const [scrollY, setScrollY] = useState(0);
  
  // Setup model and materials
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Control car animation time based on scroll position
  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach(action => {
        if (action) {
          // Ensure animation is paused and ready for manual control
          action.paused = true;
          action.play();
          
          // Calculate animation time based on scroll position
          // Start animation at 100px scroll, full animation at 1200px scroll
          const scrollStart = 0;
          const scrollRange = 2000; // 1200 - 100
          const scrollProgress = Math.max(0, Math.min(1, (scrollY - scrollStart) / scrollRange));
          
          // Set animation time based on scroll progress
          const animationDuration = action.getClip().duration;
          action.time = scrollProgress * animationDuration;
        }
      });
    }
  }, [actions, scrollY]);

  // Car animation - move from right to center, then to left based on scroll
  useFrame(() => {
    if (carRef.current) {
      const currentX = carRef.current.position.x;
      const scrollProgress = Math.max(0, Math.min(1, scrollY / 2000));
      
      // Initial movement from right to center (automatic)
      const initialTargetX = 0;
      if (currentX > initialTargetX && scrollY < 500) {
        carRef.current.position.x = THREE.MathUtils.lerp(currentX, initialTargetX, 0.02);
      } else {
        // Scroll-controlled movement from center to left (max left at 1000px)
        const leftScrollProgress = Math.max(0, Math.min(1, (scrollY - 500) / 500)); // 500px to 1000px range
        const scrollTargetX = -leftScrollProgress * 3; // Move 3 units to the left
        carRef.current.position.x = THREE.MathUtils.lerp(currentX, scrollTargetX, 0.02);
      }
      
      // Rotate car based on scroll position
      const baseRotation = -Math.PI / 2; // Keep car facing left
      const scrollRotation = scrollProgress * Math.PI * 2; // Full 360 degree rotation
      carRef.current.rotation.y = baseRotation + scrollRotation;
      
      carRef.current.position.y = -2;
    }
  });

  return (
    <group>
      <primitive 
        ref={carRef} 
        object={scene} 
        scale={1.5}
        position={[15, -20, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        dispose={null}
      />
    </group>
  );
};


const ResponsiveText = () => {
  const { viewport } = useThree();
  const textRef = useRef();
  const [scrollY, setScrollY] = useState(0);
  
  // Calculate responsive font size based on viewport width
  const fontSize = Math.max(1, Math.min(8, viewport.width * 0.3));
  
  // Scroll listener for text movement
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate text position based on scroll
  useFrame(() => {
    if (textRef.current) {
      // Move text upward as user scrolls down
      const scrollFactor = scrollY * 0.01; // Adjust speed of text movement
      textRef.current.position.y = 1 + scrollFactor;
    }
  });
  
  return (
    <Billboard
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      <Text
        ref={textRef}
        position={[0, 1, -8]}
        fontSize={fontSize}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        Experience
      </Text>
    </Billboard>
  );
};

const CameraController = () => {
  const { camera } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const initialRotation = useRef({ x: 0, y: 0, z: 0 });
  
  useEffect(() => {
    // Store the initial camera rotation
    initialRotation.current = {
      x: camera.rotation.x,
      y: camera.rotation.y,
      z: camera.rotation.z
    };
    
    const handleMouseMove = (event) => {
      // Normalize mouse position to -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera]);
  
  useFrame(() => {
    // Calculate target rotation relative to initial position
    const targetX = initialRotation.current.x + (-mouse.y * 0.01);
    const targetY = initialRotation.current.y + (-mouse.x * 0.01);
    
    // Smoothly interpolate camera rotation
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetX, 0.02);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetY, 0.02);
  });
  
  return null;
};

const Hero = () => {
  return (
    <group>
      <CameraController />
      
      {/* Responsive 3D Text behind the car for depth */}
      <ResponsiveText />
      
      <CarModel />
      
      {/* Lighting setup for car */}
      <ambientLight intensity={1.2} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2.0} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={1.0} 
        color="#ffffff"
      />
      <directionalLight 
        position={[0, 15, 0]} 
        intensity={0.8} 
        color="#ffffff"
      />
    </group>
  );
};

export default Hero;
