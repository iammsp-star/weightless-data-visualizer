import React, { useState, useEffect } from 'react';
import Scene from './components/Scene';

function App() {
  const [dataPoints, setDataPoints] = useState([]);
  const [hoveredData, setHoveredData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Correctly fetch data taking the base URL into account
    const baseUrl = import.meta.env.BASE_URL;
    const url = `${baseUrl}data.json`;

    fetch(url)
      .then(res => res.json())
      .then(data => setDataPoints(data))
      .catch(err => console.error("Failed to load data:", err));
  }, []);

  // Search Logic
  const highlightedData = React.useMemo(() => {
    if (!searchTerm) return null;
    return dataPoints.find(d => d.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, dataPoints]);

  // Auto-select (hover) the searched item
  useEffect(() => {
    if (highlightedData) {
      setHoveredData(highlightedData);
    }
  }, [highlightedData]);

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        padding: '40px',
        boxSizing: 'border-box',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* Header */}
        <h1 style={{ margin: 0, fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#eee' }}>
          WEIGHTLESS DATA
        </h1>
        <p style={{ margin: 0, fontSize: '1rem', color: '#888', letterSpacing: '0.1em' }}>
          INTERACTIVE 3D VISUALIZATION
        </p>

        {/* Search Input */}
        <div style={{ marginTop: '20px', pointerEvents: 'auto' }}>
          <input
            type="text"
            placeholder="Search Athlete..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 15px',
              fontSize: '1rem',
              borderRadius: '5px',
              border: '1px solid #444',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              outline: 'none',
              width: '250px'
            }}
          />
        </div>

        {/* Counter */}
        <div style={{ position: 'absolute', top: '40px', right: '40px', textAlign: 'right' }}>
          <div style={{ fontSize: '3rem', fontWeight: 700 }}>
            {dataPoints.length.toString().padStart(3, '0')}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>ACTIVE NODES</div>
        </div>

        {/* Stats / Legend */}
        <div style={{ position: 'absolute', bottom: '40px', left: '40px', maxWidth: '300px' }}>
          <p style={{ color: '#666', lineHeight: '1.5', fontSize: '0.9rem' }}>
            Hover over nodes to inspect values. Data points are distributed in a localized cluster.
            Height represents relative value magnitude.
            <br /><br />
            <span style={{ color: '#ffaa00' }}>● Elite</span> <span style={{ color: '#00ffff' }}>● Intermediate</span> <span style={{ color: '#00ff88' }}>● Beginner</span>
          </p>
        </div>

        {/* Tooltip */}
        {hoveredData && (
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            background: 'rgba(0,0,0,0.8)',
            border: `1px solid ${hoveredData.category === 'Elite' ? '#ffaa00' : hoveredData.category === 'Intermediate' ? '#00ffff' : '#00ff88'}`,
            padding: '20px',
            borderRadius: '4px',
            backdropFilter: 'blur(4px)',
            minWidth: '200px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#fff' }}>{hoveredData.label}</h3>
            <div style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Category:</span>
                <span style={{ color: hoveredData.category === 'Elite' ? '#ffaa00' : hoveredData.category === 'Intermediate' ? '#00ffff' : '#00ff88' }}>
                  {hoveredData.category}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Strength Score:</span>
                <span style={{ fontWeight: 'bold', color: 'white' }}>{hoveredData.raw_value}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Pull-ups:</span>
                <span>{hoveredData.stats.pullups}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Muscle-ups:</span>
                <span>{hoveredData.stats.muscleups}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Scene
        dataPoints={dataPoints}
        onHover={setHoveredData}
        highlightedId={highlightedData ? highlightedData.id : null}
      />
    </>
  );
}

export default App;
