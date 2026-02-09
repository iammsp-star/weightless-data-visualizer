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
        fontFamily: 'Inter, sans-serif'
      }}>
        <h1 style={{ margin: 0, fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#eee' }}>
          WEIGHTLESS DATA
        </h1>
        <p style={{ margin: 0, fontSize: '1rem', color: '#888', letterSpacing: '0.1em' }}>
          INTERACTIVE 3D VISUALIZATION
        </p>

        <div style={{ position: 'absolute', top: '40px', right: '40px', textAlign: 'right' }}>
          <div style={{ fontSize: '3rem', fontWeight: 700 }}>
            {dataPoints.length.toString().padStart(3, '0')}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>ACTIVE NODES</div>
        </div>

        <div style={{ position: 'absolute', bottom: '40px', left: '40px', maxWidth: '300px' }}>
          <p style={{ color: '#666', lineHeight: '1.5', fontSize: '0.9rem' }}>
            Hover over nodes to inspect values. Data points are distributed in a localized cluster.
            Height represents relative value magnitude.
            <br /><br />
            <span style={{ color: '#ffaa00' }}>● Elite</span> <span style={{ color: '#00ffff' }}>● Intermediate</span> <span style={{ color: '#00ff88' }}>● Beginner</span>
          </p>
        </div>
      </div>

      <Scene dataPoints={dataPoints} />
    </>
  );
}

export default App;
