import React from 'react';
import Scene from './components/Scene';

function App() {
  return (
    <>
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicks to pass through to canvas
        zIndex: 10,
        padding: '2rem',
        boxSizing: 'border-box',
        color: 'white',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '3rem',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              background: 'linear-gradient(to right, #fff, #888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              WEIGHTLESS DATA
            </h1>
            <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem', letterSpacing: '0.1em' }}>
              INTERACTIVE 3D VISUALIZATION
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>050</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>ACTIVE NODES</div>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          opacity: 0.4,
          fontSize: '0.8rem',
          maxWidth: '300px'
        }}>
          Hover over nodes to inspect values.
          Data points are distributed in a localized cluster.
          Height represents relative value magnitude.
        </div>
      </div>

      {/* 3D Scene */}
      <Scene />
    </>
  );
}

export default App;
