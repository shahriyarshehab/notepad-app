import React from 'react';
import Inkr from './Inkr';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [theme, setTheme] = React.useState('dark');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('app-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme-mode');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
      </div>
      <Inkr theme={theme} />
    </div>
  );
}

export default App;