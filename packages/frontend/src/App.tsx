import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Get backend URL from Vite-injected environment variables
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3002';
    console.log('Connecting to backend at:', backendUrl);
    
    // API call to backend
    fetch(backendUrl)
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Node SVG</h1>
      </header>
      <main>
        <div className="card">
          <p>
            {message || 'Loading...'}
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
