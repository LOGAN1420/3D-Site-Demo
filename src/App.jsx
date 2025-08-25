import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Hero from "./components/Hero";
import SecondScene from "./components/SecondScene";
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
          fontFamily: "'Raleway', sans-serif",
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

// CSS Circular Mask Overlay Component
const CircularMask = ({ scrollY, onTransitionComplete }) => {
  const [transitionState, setTransitionState] = useState('none');
  const [maskScale, setMaskScale] = useState(0);
  
  useEffect(() => {
    // Define scroll ranges for different phases
    const startScroll = 2200;
    const expandEndScroll = 2400; // 200px to expand
    const stayEndScroll = 2600; // 200px to stay full
    const shrinkEndScroll = 2800; // 200px to shrink
    
    if (scrollY < startScroll) {
      setMaskScale(0);
      if (transitionState !== 'none') {
        setTransitionState('none');
        onTransitionComplete(false);
      }
    } else if (scrollY >= startScroll && scrollY < expandEndScroll) {
      // Expanding phase with smooth easing
      const progress = (scrollY - startScroll) / (expandEndScroll - startScroll);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out for smoother scaling
      setMaskScale(easedProgress * 150); // Scale to 150vw to cover screen
      if (transitionState !== 'expanding') {
        setTransitionState('expanding');
      }
    } else if (scrollY >= expandEndScroll && scrollY < stayEndScroll) {
      setMaskScale(150);
      if (transitionState !== 'full') {
        setTransitionState('full');
      }
    } else if (scrollY >= stayEndScroll && scrollY < shrinkEndScroll) {
      // Shrinking phase with smooth easing
      const progress = (scrollY - stayEndScroll) / (shrinkEndScroll - stayEndScroll);
      const easedProgress = Math.pow(progress, 3); // Cubic ease-in for smoother scaling
      setMaskScale(150 * (1 - easedProgress));
      if (transitionState !== 'shrinking') {
        setTransitionState('shrinking');
        onTransitionComplete(true);
      }
    } else if (scrollY >= shrinkEndScroll) {
      setMaskScale(0);
      if (transitionState !== 'complete') {
        setTransitionState('complete');
      }
    }
  }, [scrollY, transitionState, onTransitionComplete]);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '100vw',
        height: '100vw',
        backgroundColor: '#FF8FAB',
        borderRadius: '50%',
        transform: `translate(-50%, -50%) scale(${maskScale / 100})`,
        transition: 'transform 0.1s ease-out',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    />
  );
};

// Bottom Pull-up Mask for second scene transition
const BottomPullMask = ({ scrollY }) => {
  const [maskHeight, setMaskHeight] = useState(0);
  
  useEffect(() => {
    const startScroll = 3600; // Start pulling up at 3000px
    const endScroll = 4000; // Finish pulling up at 3400px
    
    if (scrollY < startScroll) {
      setMaskHeight(0);
    } else if (scrollY >= startScroll && scrollY < endScroll) {
      const progress = (scrollY - startScroll) / (endScroll - startScroll);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      setMaskHeight(easedProgress * 100); // Pull up to 100vh
    } else if (scrollY >= endScroll) {
      setMaskHeight(100);
    }
  }, [scrollY]);
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        height: `${maskHeight}vh`,
        backgroundColor: '#FF8FAB',
        transition: 'height 0.1s ease-out',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    />
  );
};

// Sliding Text Animation Component
const SlidingText = ({ scrollY }) => {
  const [leftTextPosition, setLeftTextPosition] = useState(-100);
  const [rightTextPosition, setRightTextPosition] = useState(100);
  
  useEffect(() => {
    const startScroll = 4100; // Start sliding after pull-up completes
    const endScroll = 4500; // Finish sliding at 3900px
    
    if (scrollY < startScroll) {
      setLeftTextPosition(-100);
      setRightTextPosition(100);
    } else if (scrollY >= startScroll && scrollY < endScroll) {
      const progress = (scrollY - startScroll) / (endScroll - startScroll);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      setLeftTextPosition(-100 + (easedProgress * 100)); // Slide from left (-100% to 0%)
      setRightTextPosition(100 - (easedProgress * 100)); // Slide from right (100% to 0%)
    } else if (scrollY >= endScroll) {
      setLeftTextPosition(0);
      setRightTextPosition(0);
    }
  }, [scrollY]);
  
  return (
    <>
      {/* First line - slides from left */}
      <div
        style={{
          position: 'fixed',
          top: '40%',
          left: '50%',
          transform: `translate(calc(-50% + ${leftTextPosition}vw), -50%)`,
          zIndex: 10000,
          fontFamily: 'Raleway, sans-serif',
          color: '#ffffff',
          fontSize: '60px',
          fontWeight: '1000',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          transition: 'transform 0.1s ease-out',
          pointerEvents: 'none'
        }}
      >
        LET US REIMAGINE YOUR BRAND FOR THE DIGITAL AGE
      </div>
      
      {/* Second line - slides from right */}
      <div
        style={{
          position: 'fixed',
          top: '48%',
          left: '50%',
          transform: `translate(calc(-50% + ${rightTextPosition}vw), -50%)`,
          zIndex: 10000,
          fontFamily: 'Raleway, sans-serif',
          color: '#ffffff',
          fontSize: '60px',
          fontWeight: '1000',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          transition: 'transform 0.1s ease-out',
          pointerEvents: 'none'
        }}
      >
        WHERE EVERY CLICK SPARKS CURIOUSITY.
      </div>
    </>
  );
};


const App = () => {
    const [carColor, setCarColor] = useState(0xdbbb0d); // Default car color (yellow)
    const [scrollY, setScrollY] = useState(0);
    const [currentScene, setCurrentScene] = useState(1); // 1 for first scene, 2 for second scene
    
    const handleTransitionComplete = (showSecondScene) => {
      setCurrentScene(showSecondScene ? 2 : 1);
    };

    useEffect(() => {
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ height: '600vh' }}>
          <Canvas 
            style={{height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0}} 
            camera={{ position: [0, 2, 10], fov: 45 }}
          >
            {/* First Scene - Hero with car */}
            {currentScene === 1 && (
              <Hero carColor={carColor} />
            )}
            
            {/* Second Scene - Draggable objects */}
            {currentScene === 2 && (
              <SecondScene />
            )}
            
            
            <Stats />
          </Canvas>
          
          {/* CSS Circular Mask Overlay */}
          <CircularMask 
            scrollY={scrollY} 
            onTransitionComplete={handleTransitionComplete}
          />
          
          {/* Bottom Pull-up Mask for second scene */}
          <BottomPullMask scrollY={scrollY} />
          
          {/* Sliding Text Animation */}
          <SlidingText scrollY={scrollY} />
          
          {/* Interactive Panel outside Canvas - hide during scene transition */}
          {currentScene === 1 && (
            <InteractivePanel scrollY={scrollY} setCarColor={setCarColor} carColor={carColor} />
          )}
          
          {/* Second Scene Text Overlay */}
          {currentScene === 2 && (
            <div style={{
              position: 'fixed',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              fontFamily: 'Raleway, sans-serif',
              color: '#ffffff',
              fontSize: '32px',
              fontWeight: '600',
              textAlign: 'center',
              maxWidth: '90vw',
              lineHeight: '1.4'
            }}>
              Turn your store into an interactive playground where customers can experience STEM toys firsthand.
            </div>
          )}
          
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
