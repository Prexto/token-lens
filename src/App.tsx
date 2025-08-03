import { useState, useEffect } from 'react';
import CoinList from './components/CoinList';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = window.localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
    }
    return 'dark'; // Default to dark theme
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen text-light-text dark:text-dark-text transition-colors duration-300 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Crypto Tracker
          </h1>
          <button
            onClick={handleThemeSwitch}
            className="w-12 h-12 rounded-full shadow-neumorphic-light-convex dark:shadow-neumorphic-dark-convex active:shadow-neumorphic-light-concave dark:active:shadow-neumorphic-dark-concave transition-all duration-150 flex items-center justify-center text-xl"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </header>
        <main>
          <CoinList />
        </main>
      </div>
    </div>
  );
}

export default App;
