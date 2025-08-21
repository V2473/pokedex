'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '@/stores';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, currentTheme, setTheme, setCurrentTheme } = useUIStore();

  useEffect(() => {
    const root = window.document.documentElement;

    // Apply the current theme to the document
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;

    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setCurrentTheme(systemPrefersDark ? 'dark' : 'light');
      } else {
        setCurrentTheme(savedTheme);
      }
    } else {
      // Default to system theme if no saved preference
      setTheme('system');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, [setTheme, setCurrentTheme]);

  useEffect(() => {
    // Handle system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };

      // Listen for changes in system preference
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme, setCurrentTheme]);

  useEffect(() => {
    // Persist theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <>{children}</>;
};