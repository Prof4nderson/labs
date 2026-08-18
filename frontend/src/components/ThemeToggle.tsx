import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialDark = savedTheme ? savedTheme === 'dark' : true;
    
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    
    if (newDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="glass px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/50 cursor-pointer flex items-center gap-2"
      title="Alternar tema cyberpunk / holográfico"
    >
      {isDark ? '☀️ Holográfico' : '🌙 Cyberpunk'}
    </button>
  );
}