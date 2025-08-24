import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Hero from "./components/Hero";

const App = () => {
    return (
        <div style={{ height: '300vh' }}>
          <Canvas 
            style={{height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0}} 
            camera={{ position: [0, 2, 10], fov: 45 }}
          >
            {/*<OrbitControls enablePan={false} enableZoom={false} />*/}
            <Hero />
            <Stats />
          </Canvas>
          
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
