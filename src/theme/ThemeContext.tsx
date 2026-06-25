import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Theme } from '../types/sdui';

interface ThemeContextValue {
  readonly theme: Theme;
  readonly setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  initialTheme,
  children,
}: {
  readonly initialTheme: Theme;
  readonly children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme }),
    [theme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) throw new Error('useTheme must be called inside ThemeProvider');
  return ctx;
}
