import React, { useState, useEffect } from 'react';
import Scene from './components/Scene';

function App() {
  const [dataPoints, setDataPoints] = useState([]);
  const [hoveredData, setHoveredData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL;
    const url = `${baseUrl}data.json`;

    fetch(url)
      .then(res => res.json())
      .then(data => setDataPoints(data))
      .catch(err => console.error("Failed to load data:", err));
  }, []);

  const highlightedData = React.useMemo(() => {
    if (!searchTerm) return null;
    return dataPoints.find(d => d.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, dataPoints]);

  const findStrongest = () => {
    if (dataPoints.length === 0) return;
    const strongest = dataPoints.reduce((max, obj) => obj.raw_value > max.raw_value ? obj : max, dataPoints[0]);
    setSearchTerm(strongest.label);
  };

  const findWeakest = () => {
    if (dataPoints.length === 0) return;
    const weakest = dataPoints.reduce((min, obj) => obj.raw_value < min.raw_value ? obj : min, dataPoints[0]);
    setSearchTerm(weakest.label);
  };

  const findStrongestInCategory = (category) => {
    const filtered = dataPoints.filter(d => d.category === category);
    if (filtered.length === 0) return;
    const strongest = filtered.reduce((max, obj) => obj.raw_value > max.raw_value ? obj : max, filtered[0]);
    setSearchTerm(strongest.label);
  };

  const findWeakestInCategory = (category) => {
    const filtered = dataPoints.filter(d => d.category === category);
    if (filtered.length === 0) return;
    const weakest = filtered.reduce((min, obj) => obj.raw_value < min.raw_value ? obj : min, filtered[0]);
    setSearchTerm(weakest.label);
  };

  useEffect(() => {
    if (highlightedData) {
      setHoveredData(highlightedData);
    }
  }, [highlightedData]);

  // CATEGORY COLORS
  const getCatColor = (cat) => {
    if (cat === 'Elite') return '#ffaa00';
    if (cat === 'Intermediate') return '#00ffff';
    return '#00ff88';
  };

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
        padding: '2rem',
        boxSizing: 'border-box',
        color: 'white',
        fontFamily: "'Inter', sans-serif"
      }}>

        {/* --- HEADER --- */}
        <div className="fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 style={{ margin: 0, fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            WEIGHTLESS
          </h1>
          <p style={{ margin: '0 0 0 4px', fontSize: '0.9rem', color: '#666', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Data Visualization
          </p>
        </div>

        {/* --- SEARCH BAR AND CONTROLS --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          <div className="glass-panel fade-in" style={{
            marginTop: '2rem',
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            animationDelay: '0.3s'
          }}>
            <span style={{ fontSize: '1.2rem', paddingRight: '10px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search Athlete..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                minWidth: '200px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div className="fade-in" style={{
            pointerEvents: 'auto',
            display: 'flex',
            gap: '10px',
            animationDelay: '0.4s'
          }}>
            <button className="glass-btn pulse-glow-amber" onClick={findStrongest}>💪 Strongest</button>
            <button className="glass-btn pulse-glow-red" onClick={findWeakest}>📉 Weakest</button>
          </div>
        </div>

        {/* --- COUNTER WIDGET --- */}
        <div className="glass-panel fade-in" style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          padding: '15px 25px',
          textAlign: 'right',
          animationDelay: '0.5s'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
            {dataPoints.length.toString().padStart(3, '0')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em', marginTop: '5px' }}>
            ACTIVE NODES
          </div>
        </div>

        {/* --- LEGEND (Bottom Center) --- */}
        <div className="glass-panel fade-in" style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '30px',
          padding: '10px 20px',
          animationDelay: '0.7s',
          pointerEvents: 'auto'
        }}>
          {['Elite', 'Intermediate', 'Beginner'].map(cat => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getCatColor(cat), boxShadow: `0 0 8px ${getCatColor(cat)}` }}></div>
              <span style={{ fontSize: '0.8rem', color: '#ddd', marginRight: '6px' }}>{cat}</span>
              <div style={{ display: 'flex', gap: '2px' }}>
                <button
                  onClick={() => findStrongestInCategory(cat)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', fontSize: '0.9rem', opacity: 0.5, transition: 'all 0.2s', filter: 'grayscale(0.8)' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = 'grayscale(0)'; e.currentTarget.style.transform = 'scale(1.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.filter = 'grayscale(0.8)'; e.currentTarget.style.transform = 'scale(1)' }}
                  title={`Strongest ${cat}`}
                >
                  💪
                </button>
                <button
                  onClick={() => findWeakestInCategory(cat)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', fontSize: '0.9rem', opacity: 0.5, transition: 'all 0.2s', filter: 'grayscale(0.8)' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = 'grayscale(0)'; e.currentTarget.style.transform = 'scale(1.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.filter = 'grayscale(0.8)'; e.currentTarget.style.transform = 'scale(1)' }}
                  title={`Weakest ${cat}`}
                >
                  📉
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- HUD DATA CARD (Floating Tooltip) --- */}
        {hoveredData && (
          <div className="glass-panel fade-in" style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            padding: '0', // Paddington moved to inner
            width: '280px',
            overflow: 'hidden',
            borderLeft: `4px solid ${getCatColor(hoveredData.category)}`
          }}>
            {/* Header Area */}
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600, color: '#fff' }}>
                {hoveredData.label}
              </h3>
              <span style={{
                display: 'inline-block',
                marginTop: '6px',
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '4px',
                background: `${getCatColor(hoveredData.category)}22`,
                color: getCatColor(hoveredData.category),
                fontWeight: 500,
                letterSpacing: '0.05em'
              }}>
                {hoveredData.category.toUpperCase()}
              </span>
            </div>

            {/* Stats Grid */}
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Strength</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{hoveredData.raw_value}</div>
              </div>
              <div>
                {/* Spacer */}
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Pull-ups</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{hoveredData.stats.pullups}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Muscle-ups</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{hoveredData.stats.muscleups}</div>
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
