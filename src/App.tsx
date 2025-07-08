import React from 'react';
import Notepad from './Notepad';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <ThemeToggle />
      </div>
      <Notepad />
    </div>
  );
}

export default App;