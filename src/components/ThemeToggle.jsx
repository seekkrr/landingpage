import React from 'react';
import { useTheme } from '../theme/ThemeContext.jsx';

export default function ThemeToggle({ hidden = true }) {
  const { theme, toggleTheme, enableEnv } = useTheme();
  if (hidden || !enableEnv) return null;
  return (
    <button
      type="button"
      className="btn btn--outline btn--sm"
      onClick={toggleTheme}
      aria-pressed={theme === 'dark'}
    >
      {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  );
}


