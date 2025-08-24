import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Hero from "./components/Hero";
import { useState, useEffect } from "react";

// Interactive Panel Component (outside Canvas)
const InteractivePanel = ({ scrollY, setCarColor, carColor }) => {
  const showPanel = scrollY >= 1000;
  const panelOpacity = showPanel ? Math.min(1, (scrollY - 1000) / 200) : 0;
  
  const colors = [
    { name: 'Default', hex: 0x333333, css: '#333333' },
    { name: 'Red', hex: 0xCC2727, css: '#CC2727' },
    { name: 'Blue', hex: 0x1616c4, css: '#1616c4' },
    { name: 'Yellow', hex: 0xdbbb0d, css: '#dbbb0d' },
    { name: 'Purple', hex: 0x6600cc, css: '#6600cc' }
  ];
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: '50%',
        right: '50px',
        transform: 'translateY(-50%)',
        opacity: panelOpacity,
        transition: 'opacity 0.3s ease',
        pointerEvents: showPanel ? 'auto' : 'none',
        zIndex: 1000,
        fontFamily: 'Azonix, Inter, sans-serif',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '24px',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        width: '800px'
      }}
    >
      <div 
        style={{
          color: '#ffffff',
          fontSize: '28px',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '24px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          lineHeight: '1.4',
          fontFamily: "'Azonix', sans-serif !important",
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          width: '100%'
        }}
      >
        Its not only the immersive experience. Its also interactable.
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        flexDirection: 'row', 
        gap: '12px',
        padding: '8px'
      }}>
        {colors.map((color) => {
          const isSelected = carColor === color.hex;
          return (
            <div
              key={color.name}
              onClick={() => setCarColor(color.hex)}
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: color.css,
                borderRadius: '8px',
                cursor: 'pointer',
                border: isSelected ? '3px solid #ffffff' : 'none',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              title={color.name}
            />
          );
        })}
      </div>
    </div>
  );
};

const App = () => {
    const [carColor, setCarColor] = useState(0x538709); // Default car color (Green)
    const [scrollY, setScrollY] = useState(0);
    
    useEffect(() => {
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ height: '300vh' }}>
          <Canvas 
            style={{height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0}} 
            camera={{ position: [0, 2, 10], fov: 45 }}
          >
            {/*<OrbitControls enablePan={false} enableZoom={false} />*/}
            <Hero carColor={carColor} />
            <Stats />
          </Canvas>
          
          {/* Interactive Panel outside Canvas */}
          <InteractivePanel scrollY={scrollY} setCarColor={setCarColor} carColor={carColor} />
          
          {/* Scrollable content to trigger rocket launch */}
          <div style={{ 
            position: 'relative', 
            zIndex: 10, 
            height: '100vh', 
            background: 'transparent'
          }}>
          </div>
          
          <div style={{ 
            position: 'relative', 
            zIndex: 10, 
            height: '100vh', 
            background: 'transparent'
          }}>
          </div>
          
          <div style={{ 
            position: 'relative', 
            zIndex: 10, 
            height: '100vh', 
            background: 'transparent'
          }}>
          </div>
        </div>
    );
};

export default App;
