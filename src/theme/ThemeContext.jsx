import React from 'react';

const ThemeContext = React.createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const enableEnv = (import.meta?.env?.VITE_ENABLE_DARK_MODE || '').toString().toLowerCase() === 'true';
  const [theme, setTheme] = React.useState(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null;
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light';
  });

  const applyDataAttr = React.useCallback((value) => {
    const root = document.documentElement;
    root.setAttribute('data-color-scheme', value === 'dark' ? 'dark' : 'light');
  }, []);

  React.useEffect(() => {
    applyDataAttr(theme);
    try {
      window.localStorage.setItem('theme', theme);
    } catch {}
  }, [theme, applyDataAttr]);

  const toggleTheme = React.useCallback(() => {
    if (!enableEnv) return; // keep inactive during alpha
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, [enableEnv]);

  const value = React.useMemo(() => ({ theme, setTheme, toggleTheme, enableEnv }), [theme, toggleTheme, enableEnv]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return React.useContext(ThemeContext);
}


