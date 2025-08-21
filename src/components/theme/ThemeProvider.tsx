import React, { useEffect } from 'react';
import { useUIStore } from '@/stores';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, currentTheme, setCurrentTheme } = useUIStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply the current theme to the document
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
    
    // Store the theme preference in localStorage
    localStorage.setItem('theme', theme);
  }, [currentTheme, theme]);

  useEffect(() => {
    // Check for system preference on initial load
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };
      
      // Set initial theme based on system preference
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
      
      // Listen for changes in system preference
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme, setCurrentTheme]);

  return <>{children}</>;
};